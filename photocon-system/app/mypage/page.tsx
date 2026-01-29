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

    // 2. Check Session (Strict Check with getUser)
    const supabase = createServerClient()
    // getSession() checks JWT only, getUser() validates against DB
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login?next=/mypage')
    }

    // 3. Fetch User's Entries
    const { data: entries, error } = await supabase
        .from('entries')
        .select('*, contests(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // 4. Calculate Stats
    const totalEntries = entries?.length || 0
    const approvedEntries = (entries as any[])?.filter(e => e.status === 'approved' || e.status === 'winner').length || 0

    return (
        <div className="bg-brand-50 min-h-screen">
            <HeaderO />
            <LayoutO>
                <ClientMyPage
                    user={user}
                    entries={entries || []}
                    stats={{ total: totalEntries, approved: approvedEntries }}
                />
            </LayoutO>
        </div>
    )
}
