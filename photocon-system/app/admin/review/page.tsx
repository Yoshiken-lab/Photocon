import { createAdminClient } from '@/lib/supabase/admin'
import { ReviewClient } from './ReviewClient'

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = createAdminClient()
  const page = Number(searchParams.page) || 1
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // 審査待ちのエントリーを取得 (Pagination)
  const { data: entries } = await supabase
    .from('entries')
    .select('*, contests(name, theme), categories(name)')
    .eq('status', 'pending')
    .order('collected_at', { ascending: true })
    .range(from, to)

  // 審査待ち総件数を取得
  const { count: pendingCount } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">審査する</h1>
        <p className="text-gray-500 mt-1">
          審査待ちの応募を確認して承認・却下を行います
          {pendingCount !== null && pendingCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
              {pendingCount}件の審査待ち
            </span>
          )}
        </p>
      </div>

      <ReviewClient
        entries={entries || []}
        totalCount={pendingCount || 0}
        currentPage={page}
        perPage={perPage}
      />
    </div>
  )
}
