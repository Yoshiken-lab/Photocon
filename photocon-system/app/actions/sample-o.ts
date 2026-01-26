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

    // Fetch active contests sorted by end_date
    const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true })

    if (error) {
        console.error('Error fetching active contests:', error)
        return []
    }

    // Force cast to bypass 'never' inference
    return (data as unknown as ContestRow[]) || []
}

export async function getPastContests() {
    const supabase = createAdminClient()

    // Fetch closed contests
    const { data, error } = await supabase
        .from('contests')
        .select('*')
        .in('status', ['closed', 'judging', 'finished'])
        .order('end_date', { ascending: false })

    if (error) {
        console.error('Error fetching past contests:', error)
        return []
    }

    return (data as unknown as ContestRow[]) || []
}

export async function getEntriesForResult(contestId: string) {
    const supabase = createAdminClient()

    // Fetch approved entries
    const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('contest_id', contestId)
        .eq('status', 'approved')
        .order('collected_at', { ascending: false })

    if (error) {
        console.error('Error fetching entries:', error)
        return []
    }

    return (data as unknown as EntryRow[]) || []
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
