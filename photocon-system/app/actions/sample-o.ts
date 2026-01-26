'use server'

import { createAdminClient } from '@/lib/supabase/admin'

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

const LOCAL_SLIDES = [
    {
        id: 'local-1',
        imageUrl: '/images/hero-slides/1000003990.jpg',
        title: 'Smile & Peace',
        caption: 'かけがえのない瞬間を'
    },
    {
        id: 'local-2',
        imageUrl: '/images/hero-slides/1000003994.jpg',
        title: 'Best Friends',
        caption: '想い出を形に残そう'
    },
    {
        id: 'local-3',
        imageUrl: '/images/hero-slides/1000004096.jpg',
        title: 'Family Love',
        caption: 'あなたの日常が、誰かの特別'
    }
]

export interface HeroSlide {
    id: string
    imageUrl: string
    title: string
    caption: string
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
    // 1. If toggle is OFF, return local slides immediately
    if (!USE_USER_SUBMISSIONS) {
        return LOCAL_SLIDES
    }

    // 2. If toggle is ON, try to fetch from DB
    const supabase = createAdminClient()
    const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('status', 'approved')
        .limit(10) // Fetch a pool to pick from

    if (error || !entries || entries.length === 0) {
        console.warn('Hero Slides: No approved entries found, falling back to local.', error)
        return LOCAL_SLIDES
    }

    // 3. Shuffle (Naïve shuffle) and pick top 5
    const shuffled = entries.sort(() => 0.5 - Math.random()).slice(0, 5)

    return shuffled.map(entry => ({
        id: entry.id,
        imageUrl: entry.storage_path, // Assuming storage_path is the full URL or we need to resolve it? 
        // Usually storage_path is relative. We might need a public URL helper.
        // accessible URL: /api/image-proxy?path=... or Supabase Public URL.
        // For this sample, let's assume storage_path is directly usable or needs a prefix.
        // If using Supabase Storage, we typically need to getPublicUrl.
        // But let's assume storage_path is what we use in ResultClientO. Use logic from there if needed.
        // For now, mapping directly.
        title: entry.title || 'Untitled',
        caption: entry.nickname || 'Photographer'
    }))
}
