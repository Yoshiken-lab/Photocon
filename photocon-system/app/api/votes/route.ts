import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { entryId } = await request.json()

    if (!entryId) {
      return NextResponse.json({ error: 'entryId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // エントリーとコンテスト情報取得
    const { data: entry, error: entryError } = await supabase
      .from('entries')
      .select('id, contest_id, status')
      .eq('id', entryId)
      .single()

    if (entryError || !entry) {
      return NextResponse.json({ error: '作品が見つかりません' }, { status: 404 })
    }

    if (entry.status !== 'approved') {
      return NextResponse.json({ error: 'この作品には投票できません' }, { status: 400 })
    }

    // コンテストの投票期間チェック
    const { data: contest } = await supabase
      .from('contests')
      .select('status, voting_start, voting_end')
      .eq('id', entry.contest_id)
      .single()

    if (contest) {
      const now = new Date()
      const votingStart = contest.voting_start ? new Date(contest.voting_start) : null
      const votingEnd = contest.voting_end ? new Date(contest.voting_end) : null

      if (votingStart && now < votingStart) {
        return NextResponse.json({ error: '投票期間前です' }, { status: 400 })
      }
      if (votingEnd && now > votingEnd) {
        return NextResponse.json({ error: '投票期間が終了しました' }, { status: 400 })
      }
    }

    // 投票者識別子生成（IPアドレス + エントリーIDのハッシュ）
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    const voterIdentifier = createHash('sha256')
      .update(`${ip}-${entryId}`)
      .digest('hex')

    // 投票実行
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        entry_id: entryId,
        voter_identifier: voterIdentifier,
      })

    if (voteError) {
      if (voteError.code === '23505') {
        return NextResponse.json({ error: '既に投票済みです' }, { status: 400 })
      }
      throw voteError
    }

    // 投票数取得
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('entry_id', entryId)

    return NextResponse.json({
      success: true,
      voteCount: count || 0,
      message: '投票しました！'
    })

  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: '投票に失敗しました' }, { status: 500 })
  }
}

// 投票取消
export async function DELETE(request: NextRequest) {
  try {
    const { entryId } = await request.json()

    if (!entryId) {
      return NextResponse.json({ error: 'entryId is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 投票者識別子生成（IPアドレス + エントリーIDのハッシュ）
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    const voterIdentifier = createHash('sha256')
      .update(`${ip}-${entryId}`)
      .digest('hex')

    // 投票を削除
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('entry_id', entryId)
      .eq('voter_identifier', voterIdentifier)

    if (deleteError) {
      throw deleteError
    }

    // 投票数取得
    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('entry_id', entryId)

    return NextResponse.json({
      success: true,
      voteCount: count || 0,
      message: '投票を取り消しました'
    })

  } catch (error) {
    console.error('Vote delete error:', error)
    return NextResponse.json({ error: '投票の取消に失敗しました' }, { status: 500 })
  }
}

// 投票数取得
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const entryId = searchParams.get('entryId')

  if (!entryId) {
    return NextResponse.json({ error: 'entryId is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { count } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('entry_id', entryId)

  // 投票済みチェック
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

  const voterIdentifier = createHash('sha256')
    .update(`${ip}-${entryId}`)
    .digest('hex')

  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('entry_id', entryId)
    .eq('voter_identifier', voterIdentifier)
    .single()

  return NextResponse.json({
    voteCount: count || 0,
    hasVoted: !!existingVote,
  })
}
