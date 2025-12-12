import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/database'

type EntryInsert = Database['public']['Tables']['entries']['Insert']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const contestId = formData.get('contestId') as string
    const nickname = formData.get('nickname') as string
    const email = formData.get('email') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!file || !contestId || !nickname || !email) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    console.log('=== Entry Submission Debug ===')
    console.log('File:', file.name, file.size, file.type)
    console.log('Contest ID:', contestId)
    console.log('Nickname:', nickname)

    // 1. 画像をStorageにアップロード
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${contestId}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('entries')
      .upload(filePath, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      console.error('Upload error details:', JSON.stringify(uploadError, null, 2))
      return NextResponse.json(
        { error: '画像のアップロードに失敗しました', details: uploadError.message },
        { status: 500 }
      )
    }
    console.log('Upload success! File path:', filePath)

    // 2. 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('entries')
      .getPublicUrl(filePath)

    const imageUrl = urlData.publicUrl

    // 3. entriesテーブルに登録
    const caption = title ? `${title}\n\n${description}` : description || null

    const entryData: EntryInsert = {
      contest_id: contestId,
      instagram_media_id: `manual-${Date.now()}`,
      instagram_permalink: imageUrl,
      media_type: 'IMAGE',
      media_url: imageUrl,
      username: nickname,
      email: email,
      caption: caption,
      status: 'pending',
      instagram_timestamp: new Date().toISOString(),
    }

    const { error: insertError } = await supabase
      .from('entries')
      .insert(entryData as never)

    if (insertError) {
      console.error('Insert error:', insertError)
      console.error('Insert error details:', JSON.stringify(insertError, null, 2))
      return NextResponse.json(
        { error: 'エントリーの登録に失敗しました', details: insertError.message },
        { status: 500 }
      )
    }
    console.log('Insert success!')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '送信に失敗しました' },
      { status: 500 }
    )
  }
}
