'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createContest(formData: FormData) {
  const supabase = createServerClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const theme = formData.get('theme') as string
  const emoji = formData.get('emoji') as string
  const image_url = formData.get('image_url') as string
  const hashtagsStr = formData.get('hashtags') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const voting_start = formData.get('voting_start') as string
  const voting_end = formData.get('voting_end') as string
  const status = formData.get('status') as string
  const is_voting_enabled = formData.get('is_voting_enabled') === 'on'

  // ハッシュタグを配列に変換
  const hashtags = hashtagsStr
    ? hashtagsStr.split(',').map((tag) => tag.trim()).filter(Boolean)
    : []

  const { data, error } = await supabase
    .from('contests')
    .insert({
      name,
      description: description || null,
      theme: theme || null,
      emoji: emoji || null,
      image_url: image_url || null,
      hashtags,
      start_date: start_date ? new Date(start_date).toISOString() : null,
      end_date: end_date ? new Date(end_date).toISOString() : null,
      voting_start: voting_start ? new Date(voting_start).toISOString() : null,
      voting_end: voting_end ? new Date(voting_end).toISOString() : null,
      status: status || 'draft',
      settings: { is_voting_enabled },
    })
    .select()
    .single()

  if (error) {
    console.error('Contest creation error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/contests')
  return { data }
}

export async function updateContest(id: string, formData: FormData) {
  const supabase = createServerClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const theme = formData.get('theme') as string
  const emoji = formData.get('emoji') as string
  const image_url = formData.get('image_url') as string
  const hashtagsStr = formData.get('hashtags') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const voting_start = formData.get('voting_start') as string
  const voting_end = formData.get('voting_end') as string
  const status = formData.get('status') as string
  const is_voting_enabled = formData.get('is_voting_enabled') === 'on'

  const hashtags = hashtagsStr
    ? hashtagsStr.split(',').map((tag) => tag.trim()).filter(Boolean)
    : []

  // Note: For now we overwrite settings. If more settings exist, we need to fetch -> merge -> update.
  // Assuming currently only is_voting_enabled exists or overwriting is acceptable for this MVP.

  const { data, error } = await supabase
    .from('contests')
    .update({
      name,
      description: description || null,
      theme: theme || null,
      emoji: emoji || null,
      image_url: image_url || null,
      hashtags,
      start_date: start_date ? new Date(start_date).toISOString() : null,
      end_date: end_date ? new Date(end_date).toISOString() : null,
      voting_start: voting_start ? new Date(voting_start).toISOString() : null,
      voting_end: voting_end ? new Date(voting_end).toISOString() : null,
      status: status || 'draft',
      settings: { is_voting_enabled },
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Contest update error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/contests')
  return { data }
}
