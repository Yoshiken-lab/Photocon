'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function requestDeletion(data: {
    entryId: string
    contestName: string
    reason: string
    userEmail: string
}) {
    const supabase = createAdminClient()

    try {
        const { error } = await supabase.from('inquiries').insert({
            category: 'delete',
            name: 'User Request', // ユーザー名が特定できない場合は固定値または取得ロジック追加
            email: data.userEmail,
            message: `【削除依頼】
対象コンテスト: ${data.contestName}
対象エントリーID: ${data.entryId}
削除理由: ${data.reason}`,
            status: 'pending'
        })

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
