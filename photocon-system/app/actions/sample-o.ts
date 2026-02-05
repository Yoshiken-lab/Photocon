'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/database'
import fs from 'fs'
import path from 'path'

// Define explicit row types to bypass inference failure
type ContestRow = Database['public']['Tables']['contests']['Row']
type EntryRow = Database['public']['Tables']['entries']['Row']
type VoteRow = Database['public']['Tables']['votes']['Row']

export async function getActiveContests() {
    const supabase = createAdminClient()
    const now = new Date().toISOString()

    // Fetch active contests based on DATE, ignoring the stale 'status' column
    // Logic: Not draft AND start_date <= now AND end_date >= now
    const { data, error } = await supabase
        .from('contests')
        .select('*')
        .neq('status', 'draft')
        .lte('start_date', now)
        .gte('end_date', now)
        .order('end_date', { ascending: true })

    if (error) {
        console.error('Error fetching active contests:', error)
        return []
    }

    // Force cast to bypass 'never' inference
    return (data as unknown as ContestRow[]) || []
}

// Helper type for the return value
export type ContestWithThumbnail = ContestRow & { thumbnail_url: string | null }

export async function getPastContests(): Promise<ContestWithThumbnail[]> {
    // 1. Check Env
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('🔥 CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in process.env!')
    }

    const supabase = createAdminClient()
    const now = new Date().toISOString()

    // 2. Fetch past contests based on DATE, not stale status
    // Logic: end_date < now AND not draft (draft should never be public)
    const { data: contests, error } = await supabase
        .from('contests')
        .select('*')
        .lt('end_date', now)
        .neq('status', 'draft')
        .order('end_date', { ascending: false })

    if (error) {
        console.error('🔥 Error fetching past contests:', JSON.stringify(error, null, 2))
        return []
    }

    if (!contests || contests.length === 0) {
        console.warn('⚠️ [getPastContests] No past contests found (end_date < now).')
        return []
    }

    // Explicit cast to avoid 'never' inference
    const typedContests = contests as unknown as ContestRow[]

    // 3. 🔥 SELF-HEALING: Fix zombie statuses (Fire and Forget)
    // If a contest has ended but status is still 'active' or 'voting', correct it.
    const zombies = typedContests.filter(c => c.status !== 'ended')
    if (zombies.length > 0) {
        console.log(`🧹 [Self-Healing] Found ${zombies.length} zombie contest(s). Auto-correcting status to 'ended'...`)
        // Run updates in parallel, don't await (Fire and Forget)
        Promise.all(
            zombies.map(z =>
                (supabase.from('contests') as any)
                    .update({ status: 'ended', updated_at: new Date().toISOString() })
                    .eq('id', z.id)
            )
        ).then(() => {
            console.log('✅ [Self-Healing] Zombie statuses corrected.')
        }).catch(err => {
            console.error('❌ [Self-Healing] Failed to correct zombie statuses:', err)
        })
    }

    // 4. Fetch thumbnails for each contest (Parallel)
    const contestsWithThumbs = await Promise.all(typedContests.map(async (contest) => {
        // Strategy: 'winner' > 'approved'. 'winner' starts with w, 'approved' with a.
        // Descending order of status will put 'winner' before 'approved' (if we filter only these two).
        const { data: entry } = await supabase
            .from('entries')
            .select('media_url')
            .eq('contest_id', contest.id)
            .in('status', ['winner', 'approved']) // Only winners or approved
            .order('status', { ascending: false }) // 'winner' > 'approved'
            .limit(1)
            .single()

        // Explicitly cast entry result
        const typedEntry = entry as unknown as { media_url: string } | null

        return {
            ...contest,
            thumbnail_url: typedEntry?.media_url || null
        }
    }))

    return contestsWithThumbs
}

export async function getContestById(id: string) {
    const supabase = createAdminClient()

    // Include short_code for structured ID display
    const { data, error } = await supabase
        .from('contests')
        .select('*, short_code')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching contest:', error)
        return null
    }

    return (data as unknown as (ContestRow & { short_code: string | null })) || null
}

export async function getEntriesForResult(contestId: string, includeAllVisible: boolean = false) {
    const supabase = createAdminClient()

    // includeAllVisible: true = Gallery mode (pending + approved for submission period)
    // includeAllVisible: false = Result mode (approved + winner only for voting/ended)
    const statusFilter = includeAllVisible ? ['pending', 'approved', 'winner'] : ['approved', 'winner']

    // Fetch entries with display_seq for structured ID
    const { data, error } = await supabase
        .from('entries')
        .select('*, display_seq')
        .eq('contest_id', contestId)
        .in('status', statusFilter)
        .order('collected_at', { ascending: false })

    if (error) {
        console.error('Error fetching entries:', error)
        return []
    }

    return (data as unknown as (EntryRow & { display_seq: number | null })[]) || []
}

// --- Hero Slideshow Logic ---

const USE_USER_SUBMISSIONS = false

export interface HeroSlide {
    id: string
    imageUrl: string
    title: string
    caption: string
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    if (!USE_USER_SUBMISSIONS) {
        try {
            const slidesDir = path.join(process.cwd(), 'slideshow')

            if (!fs.existsSync(slidesDir)) {
                console.warn('Slideshow directory not found:', slidesDir)
                return []
            }

            const files = fs.readdirSync(slidesDir)
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))

            return imageFiles.map((file, index) => ({
                id: `local-dynamic-${index}`,
                imageUrl: `/api/slideshow/${file}`,
                title: 'Photo Contest',
                caption: '素敵な瞬間を共有しよう'
            }))
        } catch (error) {
            console.error('Error reading local slideshow directory:', error)
            return []
        }
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('status', 'approved')
        .limit(10)

    if (error || !data || data.length === 0) {
        console.warn('Hero Slides: No approved entries found.', error)
        return []
    }

    // Force cast
    const entries = data as unknown as EntryRow[]

    const shuffled = entries.sort(() => 0.5 - Math.random()).slice(0, 5)

    return shuffled.map(entry => {
        const rawCaption = entry.caption || ''
        const parts = rawCaption.split('\n\n')
        const title = parts.length > 1 ? parts[0] : (entry.caption ? entry.caption.substring(0, 20) : 'Untitled')

        return {
            id: entry.id,
            imageUrl: entry.media_url,
            title: title || 'Untitled',
            caption: entry.username || 'Photographer'
        }
    })
}

// --- Voting Logic ---

export async function voteForEntry(entryId: string, voterIdentifier: string) {
    const supabase = createAdminClient()

    // 1. Check if already voted
    const { data: voteData } = await supabase
        .from('votes')
        .select('id')
        .eq('entry_id', entryId)
        .eq('voter_identifier', voterIdentifier)
        .single()

    // Explicit cast for single result
    const existingVote = voteData as unknown as { id: string } | null

    if (existingVote) {
        // --- REMOVE VOTE ---
        // Cast chain to any to bypass 'never' check for delete matches
        const { error: deleteError } = await (supabase
            .from('votes') as any)
            .delete()
            .eq('id', existingVote.id)

        if (deleteError) {
            console.error('Vote Delete Error:', deleteError)
            return { success: false, message: '投票の取り消しに失敗しました' }
        }

        // Decrement like_count
        const { data: entryData } = await supabase
            .from('entries')
            .select('like_count')
            .eq('id', entryId)
            .single()

        const entry = entryData as unknown as EntryRow | null

        if (entry) {
            const currentLikes = entry.like_count ?? 0
            // Cast chain to any to bypass 'never' check for update
            await (supabase
                .from('entries') as any)
                .update({ like_count: Math.max(0, currentLikes - 1) })
                .eq('id', entryId)
        }

        return { success: true, action: 'removed', message: '投票を取り消しました' }

    } else {
        // --- ADD VOTE ---
        const { error: voteError } = await (supabase
            .from('votes') as any)
            .insert({
                entry_id: entryId,
                voter_identifier: voterIdentifier
            })

        if (voteError) {
            console.error('Vote Error:', voteError)
            return { success: false, message: '投票に失敗しました' }
        }

        // Increment like_count
        const { data: entryData } = await supabase
            .from('entries')
            .select('like_count')
            .eq('id', entryId)
            .single()

        const entry = entryData as unknown as EntryRow | null

        if (entry) {
            const currentLikes = entry.like_count ?? 0
            await (supabase
                .from('entries') as any)
                .update({ like_count: currentLikes + 1 })
                .eq('id', entryId)
        }

        return { success: true, action: 'added', message: '投票しました！' }
    }
}

export async function getMyVotes(voterIdentifier: string) {
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('votes')
        .select('entry_id')
        .eq('voter_identifier', voterIdentifier)

    if (error) {
        console.error('Fetch Votes Error:', error)
        return []
    }

    const votes = (data as unknown as VoteRow[]) || []
    return votes.map(v => v.entry_id)
}
