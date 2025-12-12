import { NextRequest, NextResponse } from 'next/server'
import { PhotoContestCollector } from '@/lib/instagram'

// Vercel Cron Job用エンドポイント
export async function GET(request: NextRequest) {
  // Cron認証チェック
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const collector = new PhotoContestCollector()
    const results = await collector.collectAll()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    console.error('Cron collection error:', error)
    return NextResponse.json(
      { error: 'Collection failed' },
      { status: 500 }
    )
  }
}
