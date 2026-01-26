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
