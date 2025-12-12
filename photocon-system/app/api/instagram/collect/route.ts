import { NextRequest, NextResponse } from 'next/server'
import { PhotoContestCollector } from '@/lib/instagram'

// GETメソッド対応（テスト用）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contestId = searchParams.get('contestId')

    const collector = new PhotoContestCollector()

    if (contestId) {
      const result = await collector.collectForContest(contestId)
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        result,
      })
    } else {
      const results = await collector.collectAll()
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results,
      })
    }
  } catch (error) {
    console.error('Collection error:', error)
    return NextResponse.json(
      { error: '収集に失敗しました', details: String(error) },
      { status: 500 }
    )
  }
}

// 手動収集API
export async function POST(request: NextRequest) {
  try {
    const { contestId } = await request.json()

    const collector = new PhotoContestCollector()

    if (contestId) {
      // 特定のコンテストのみ収集
      const result = await collector.collectForContest(contestId)
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        result,
      })
    } else {
      // 全アクティブコンテスト収集
      const results = await collector.collectAll()
      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        results,
      })
    }
  } catch (error) {
    console.error('Collection error:', error)
    return NextResponse.json(
      { error: '収集に失敗しました' },
      { status: 500 }
    )
  }
}
