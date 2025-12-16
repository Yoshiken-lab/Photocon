import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'active', 'upcoming', 'ended', 'all'

    // LP用: 全てのコンテストを取得（ステータス別に分類）
    if (type === 'all' || type === 'lp') {
      const { data: contests, error } = await supabase
        .from('contests')
        .select(`
          id,
          name,
          description,
          theme,
          emoji,
          image_url,
          hashtags,
          start_date,
          end_date,
          status
        `)
        .in('status', ['active', 'upcoming', 'ended', 'voting'])
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error fetching contests:', error)
        return NextResponse.json({ active: [], upcoming: [], ended: [] }, { status: 200 })
      }

      // 各コンテストの応募数を取得
      const contestsWithCounts = await Promise.all(
        (contests || []).map(async (contest) => {
          const { count: entryCount } = await supabase
            .from('entries')
            .select('*', { count: 'exact', head: true })
            .eq('contest_id', contest.id)
            .eq('status', 'approved')

          const { data: votesData } = await supabase
            .from('entries')
            .select('like_count')
            .eq('contest_id', contest.id)
            .eq('status', 'approved')

          const totalVotes = votesData?.reduce((sum, e) => sum + (e.like_count || 0), 0) || 0

          return {
            ...contest,
            entry_count: entryCount || 0,
            total_votes: totalVotes,
          }
        })
      )

      // ステータス別に分類
      const now = new Date()
      const result = {
        active: contestsWithCounts.filter((c) => c.status === 'active' || c.status === 'voting'),
        upcoming: contestsWithCounts.filter((c) => c.status === 'upcoming'),
        ended: contestsWithCounts.filter((c) => c.status === 'ended'),
      }

      // CORSヘッダーを追加（LPからのアクセス用）
      return NextResponse.json(result, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      })
    }

    // 既存の動作: activeのみ取得
    const { data, error } = await supabase
      .from('contests')
      .select('id, name, description, status')
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching contests:', error)
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// CORSプリフライト対応
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
