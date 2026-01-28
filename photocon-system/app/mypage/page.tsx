import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAuthEnabled } from '@/lib/config'
import { HeaderO } from '@/components/o/HeaderO'
import { LayoutO } from '@/components/o/LayoutO'
import ClientMyPage from './ClientMyPage'

export const dynamic = 'force-dynamic'

export default async function MyPage() {
    // 1. Check Feature Flag
    if (!isAuthEnabled()) {
        redirect('/')
    }

    // 2. Check Session
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect('/login?next=/mypage')
    }

    // 3. Fetch User's Entries
    const { data: entries, error } = await supabase
        .from('entries')
        .select('*, contests(name)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

    // 4. Calculate Stats
    const totalEntries = entries?.length || 0
    const approvedEntries = entries?.filter(e => e.status === 'approved' || e.status === 'winner').length || 0

    return (
        <div className="bg-brand-50 min-h-screen">
            <HeaderO />
            <LayoutO>
                <ClientMyPage
                    user={session.user}
                    entries={entries || []}
                    stats={{ total: totalEntries, approved: approvedEntries }}
                />
            </LayoutO>
        </div>
    )
}
