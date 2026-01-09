import { Suspense } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { EntriesClient } from './EntriesClient'

interface SearchParams {
  status?: string
  contest?: string
  search?: string
}

export default async function AdminEntriesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createAdminClient()

  // コンテスト一覧を取得
  const { data: contests } = await supabase
    .from('contests')
    .select('id, name, status')
    .order('start_date', { ascending: false })

  // エントリー取得（コンテスト情報も含める）
  let query = supabase
    .from('entries')
    .select('*, categories(name), contests(id, name)')
    .order('collected_at', { ascending: false })

  // ステータスフィルタ
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  // コンテストフィルタ
  if (searchParams.contest) {
    query = query.eq('contest_id', searchParams.contest)
  }

  const { data: entries } = await query

  // 検索フィルタ（クライアント側で処理するためにサーバーでは全件取得）
  let filteredEntries = entries || []
  if (searchParams.search) {
    const searchLower = searchParams.search.toLowerCase()
    filteredEntries = filteredEntries.filter(entry =>
      entry.username?.toLowerCase().includes(searchLower) ||
      entry.caption?.toLowerCase().includes(searchLower)
    )
  }

  // 統計情報
  const stats = {
    total: entries?.length || 0,
    pending: entries?.filter(e => e.status === 'pending').length || 0,
    approved: entries?.filter(e => e.status === 'approved').length || 0,
    rejected: entries?.filter(e => e.status === 'rejected').length || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">応募一覧</h1>
        <p className="text-gray-500 mt-1">応募作品の検索・フィルタ・一括管理</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <EntriesClient
          entries={filteredEntries}
          contests={contests || []}
          currentStatus={searchParams.status}
          currentContest={searchParams.contest}
          currentSearch={searchParams.search}
          stats={stats}
        />
      </Suspense>
    </div>
  )
}
