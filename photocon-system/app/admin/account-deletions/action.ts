'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database'

type AccountDeletionRequest = Database['public']['Tables']['account_deletion_requests']['Row']

/**
 * 全ての削除申請を取得
 */
export async function getAccountDeletionRequests(): Promise<AccountDeletionRequest[]> {
    const supabase = createServerClient()

    const { data, error } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .order('requested_at', { ascending: false }) as { data: AccountDeletionRequest[] | null; error: unknown }

    if (error || !data) {
        console.error('Failed to fetch deletion requests:', error)
        return []
    }

    return data
}

/**
 * 削除申請を処理（承認または却下）
 */
export async function processAccountDeletion(
    requestId: string,
    action: 'approve' | 'reject'
): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient()

    // 管理者セッション確認
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        return { success: false, error: '管理者ログインが必要です' }
    }

    // 申請情報を取得
    const { data: request } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .eq('id', requestId)
        .single() as { data: AccountDeletionRequest | null; error: unknown }

    if (!request) {
        return { success: false, error: '申請が見つかりません' }
    }

    if (request.status !== 'pending') {
        return { success: false, error: 'この申請は既に処理済みです' }
    }

    if (action === 'approve') {
        // ユーザーを削除（Service Role Key必要）
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(request.user_id)

        if (deleteError) {
            console.error('Failed to delete user:', deleteError)
            return { success: false, error: 'ユーザー削除に失敗しました: ' + deleteError.message }
        }

        // 申請ステータスを更新
        const { error: updateError } = await supabase
            .from('account_deletion_requests')
            .update({
                status: 'approved',
                processed_at: new Date().toISOString(),
                processed_by: session.user.id,
            } as never)
            .eq('id', requestId)

        if (updateError) {
            console.error('Failed to update request status:', updateError)
            // ユーザーは削除されたので、エラーは発生しても続行
        }
    } else {
        // 却下の場合
        const { error: updateError } = await supabase
            .from('account_deletion_requests')
            .update({
                status: 'rejected',
                processed_at: new Date().toISOString(),
                processed_by: session.user.id,
            } as never)
            .eq('id', requestId)

        if (updateError) {
            console.error('Failed to update request status:', updateError)
            return { success: false, error: 'ステータス更新に失敗しました' }
        }
    }

    revalidatePath('/admin/account-deletions')
    return { success: true }
}
