'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type AwardLabel = 'gold' | 'silver' | 'bronze' | null

export async function updateEntryAward(entryId: string, awardLabel: AwardLabel) {
    const supabase = createAdminClient()

    try {
        const { error } = await supabase
            .from('entries')
            .update({
                award_label: awardLabel,
                // 入賞したらステータスも 'winner' にする
                // 入賞取り消し(null)なら 'approved' に戻す
                status: awardLabel ? 'winner' : 'approved'
            } as any) // Type assertion until fully updated
            .eq('id', entryId)

        if (error) {
            console.error('Error updating award:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/ranking')
        return { success: true }
    } catch (err) {
        console.error('Unexpected error:', err)
        return { success: false, error: '予期せぬエラーが発生しました' }
    }
}
