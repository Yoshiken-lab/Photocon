'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/database'

export type DeletionRequestStatus = 'pending' | 'approved' | 'rejected' | null

type AccountDeletionRequest = Database['public']['Tables']['account_deletion_requests']['Row']
type AccountDeletionInsert = Database['public']['Tables']['account_deletion_requests']['Insert']

/**
 * アカウント削除を申請する
 */
export async function requestAccountDeletion(reason: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createServerClient()

    // 1. セッション確認
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        return { success: false, error: 'ログインが必要です' }
    }

    const userId = session.user.id
    const userEmail = session.user.email || ''

    // 2. 既存の申請を確認（pending状態のものがあれば拒否）
    const { data: existingRequest } = await supabase
        .from('account_deletion_requests')
        .select('id, status')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .single() as { data: AccountDeletionRequest | null; error: unknown }

    if (existingRequest) {
        return { success: false, error: '既に削除申請中です。運営の確認をお待ちください。' }
    }

    // 3. 申請を作成
    const insertData: AccountDeletionInsert = {
        user_id: userId,
        user_email: userEmail,
        reason: reason || null,
    }

    const { error } = await supabase
        .from('account_deletion_requests')
        .insert(insertData as never)

    if (error) {
        console.error('Failed to create deletion request:', error)
        return { success: false, error: '申請の送信に失敗しました' }
    }

    revalidatePath('/mypage')
    return { success: true }
}

/**
 * 自分の削除申請状態を取得する
 */
export async function getMyDeletionRequest(): Promise<{ status: DeletionRequestStatus; requestedAt?: string }> {
    const supabase = createServerClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        return { status: null }
    }

    const { data } = await supabase
        .from('account_deletion_requests')
        .select('status, requested_at')
        .eq('user_id', session.user.id)
        .order('requested_at', { ascending: false })
        .limit(1)
        .single() as { data: Pick<AccountDeletionRequest, 'status' | 'requested_at'> | null; error: unknown }

    if (!data) {
        return { status: null }
    }

    return {
        status: data.status as DeletionRequestStatus,
        requestedAt: data.requested_at,
    }
}

