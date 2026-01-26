'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import fs from 'fs'
import path from 'path'

export async function getActiveContests() {
    const supabase = createAdminClient()

    // Fetch active contests sorted by end_date
    // We want the most relevant active contest (e.g. closest ending date or just started)
    const { data: contests, error } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true })

    if (error) {
        console.error('Error fetching active contests:', error)
        return []
    }

    return contests || []
}

export async function getPastContests() {
    const supabase = createAdminClient()

    // Fetch closed contests
    const { data: contests, error } = await supabase
        .from('contests')
        .select('*')
        .in('status', ['closed', 'judging', 'finished']) // Assuming these are past statuses
        .order('end_date', { ascending: false })

    if (error) {
        console.error('Error fetching past contests:', error)
        return []
    }

    return contests || []
}

export async function getEntriesForResult(contestId: string) {
    const supabase = createAdminClient()

    // Fetch approved entries for the specific contest
    const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('contest_id', contestId)
        .eq('status', 'approved')
        .order('collected_at', { ascending: false }) // Newest first for now, or random/likes if available

    if (error) {
        console.error('Error fetching entries:', error)
        return []
    }

    return entries || []
}

// --- Hero Slideshow Logic ---

// Toggle this to TRUE to enable random approved user submissions
const USE_USER_SUBMISSIONS = false

export interface HeroSlide {
    id: string
    imageUrl: string
    title: string
    caption: string
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    // 1. If toggle is OFF, return LOCAL slides from the filesystem dynamically
    if (!USE_USER_SUBMISSIONS) {
        try {
            // Read from the local 'slideshow' folder adjacent to the app root (project_root/photocon-system/slideshow)
            // process.cwd() is normally the project root (photocon-system)
            // We want to list files in 'slideshow' directory.
            const slidesDir = path.join(process.cwd(), 'slideshow')

            // Ensure directory exists
            if (!fs.existsSync(slidesDir)) {
                console.warn('Slideshow directory not found:', slidesDir)
                return []
            }

            const files = fs.readdirSync(slidesDir)

            // Filter image files (simple check)
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))

            return imageFiles.map((file, index) => ({
                id: `local-dynamic-${index}`,
                // Point to our new API route that serves these files
                imageUrl: `/api/slideshow/${file}`,
                title: 'Photo Contest', // Generic title or extract from filename
                caption: '素敵な瞬間を共有しよう' // Generic caption
            }))
        } catch (error) {
            console.error('Error reading local slideshow directory:', error)
            return []
        }
    }

    // 2. If toggle is ON, try to fetch from DB
    const supabase = createAdminClient()
    const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('status', 'approved')
        .limit(10) // Fetch a pool to pick from

    if (error || !entries || entries.length === 0) {
        console.warn('Hero Slides: No approved entries found.', error)
        // Fallback to empty if DB fails, or we could duplicate the local logic here as fallback
        return []
    }

    // 3. Shuffle (Naïve shuffle) and pick top 5
    const shuffled = entries.sort(() => 0.5 - Math.random()).slice(0, 5)

    return shuffled.map(entry => ({
        id: entry.id,
        imageUrl: entry.storage_path,
        title: entry.title || 'Untitled',
        caption: entry.nickname || 'Photographer'
    }))
}

// --- Voting Logic ---

export async function voteForEntry(entryId: string, voterIdentifier: string) {
    const supabase = createAdminClient()

    // 1. Check if already voted (Simple duplicate check)
    const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('entry_id', entryId)
        .eq('voter_identifier', voterIdentifier)
        .single()

    if (existingVote) {
        return { success: false, message: 'すでに投票済みです' }
    }

    // 2. Insert Vote
    const { error: voteError } = await supabase
        .from('votes')
        .insert({
            entry_id: entryId,
            voter_identifier: voterIdentifier
        })

    if (voteError) {
        console.error('Vote Error:', voteError)
        return { success: false, message: '投票に失敗しました' }
    }

    // 3. Increment like_count securely (using rpc is better, but simple update for now)
    // We fetch current count first
    const { data: entry } = await supabase
        .from('entries')
        .select('like_count')
        .eq('id', entryId)
        .single()

    if (entry) {
        await supabase
            .from('entries')
            .update({ like_count: (entry.like_count || 0) + 1 })
            .eq('id', entryId)
    }

    return { success: true, message: '投票しました！' }
}
