import { Suspense } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { StatusFilter } from '@/components/admin'
import { EntriesClient } from './EntriesClient'

interface SearchParams {
  status?: string
}

export default async function AdminEntriesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createAdminClient()

  // エントリー取得
  let query = supabase
    .from('entries')
    .select('*, categories(name)')
    .order('collected_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: entries } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">応募一覧</h1>
        <p className="text-gray-500 mt-1">応募作品の承認・却下を管理</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <StatusFilter currentStatus={searchParams.status} />
      </Suspense>

      <EntriesClient entries={entries || []} />
    </div>
  )
}
