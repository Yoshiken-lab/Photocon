'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateEntryStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('entries')
    .update({ status, updated_at: new Date().toISOString() } as any)
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update entry: ${error.message}`)
  }

  revalidatePath('/admin/entries')
  revalidatePath('/admin/review')
  revalidatePath('/admin', 'layout')
  revalidatePath('/gallery')

  return { success: true }
}
