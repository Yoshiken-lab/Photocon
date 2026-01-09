import { createAdminClient } from '@/lib/supabase/admin'
import { RankingClient } from './RankingClient'

interface Contest {
  id: string
  name: string
  theme: string | null
  status: string
}

export default async function RankingPage({
  searchParams,
}: {
  searchParams: { contest?: string }
}) {
  const supabase = createAdminClient()

  // コンテスト一覧を取得
  const { data: contests } = await supabase
    .from('contests')
    .select('id, name, theme, status')
    .in('status', ['active', 'voting', 'ended'])
    .order('start_date', { ascending: false })

  const contestList = contests as Contest[] || []

  // 選択中のコンテストID（なければ最初のコンテスト）
  const selectedContestId = searchParams.contest || contestList[0]?.id

  // ランキングデータを取得（承認済みのみ、投票数順）
  let entries: { id: string; media_url: string; username: string; like_count: number; caption: string | null }[] = []

  if (selectedContestId) {
    const { data } = await supabase
      .from('entries')
      .select('id, media_url, username, like_count, caption')
      .eq('contest_id', selectedContestId)
      .eq('status', 'approved')
      .order('like_count', { ascending: false })
      .limit(50)

    entries = data || []
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ランキング</h1>
        <p className="text-gray-500 mt-1">投票数によるランキングと入賞者管理</p>
      </div>

      <RankingClient
        contests={contestList}
        entries={entries}
        selectedContestId={selectedContestId}
      />
    </div>
  )
}
