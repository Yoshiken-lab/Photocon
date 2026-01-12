import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { visitorId, deviceType } = await request.json()

    if (!visitorId || !deviceType) {
      return NextResponse.json(
        { error: 'visitorId and deviceType are required' },
        { status: 400 }
      )
    }

    // デバイスタイプのバリデーション
    if (!['mobile', 'desktop', 'tablet'].includes(deviceType)) {
      return NextResponse.json(
        { error: 'Invalid deviceType' },
        { status: 400 }
      )
    }

    // IPアドレス取得
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded
      ? forwarded.split(',')[0].trim()
      : request.headers.get('x-real-ip') || null

    const supabase = createAdminClient()

    // ページビューを記録
    const { error } = await supabase
      .from('page_views')
      .insert({
        visitor_id: visitorId,
        device_type: deviceType,
        ip_address: ipAddress,
        accessed_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Page view insert error:', error)
      throw error
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Page view error:', error)
    return NextResponse.json(
      { error: 'Failed to record page view' },
      { status: 500 }
    )
  }
}
