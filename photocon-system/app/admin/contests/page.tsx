import { createServerClient } from '@/lib/supabase/server'
import ContestsClient from './ContestsClient'

export default async function AdminContestsPage() {
  const supabase = createServerClient()

  const { data: contests } = await supabase
    .from('contests')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  return <ContestsClient contests={contests} />
}
