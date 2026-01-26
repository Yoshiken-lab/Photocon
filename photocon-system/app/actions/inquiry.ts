'use server'

import { createServerClient as createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

// -----------------------------------------------------------------------------
// Schema Definitions (魂のバリデーション)
// -----------------------------------------------------------------------------

const inquirySchema = z.object({
    // Zod v4 or non-standard version might have strict enum types. 
    // safely matching the string properly.
    category: z.enum(['contest', 'delete', 'system', 'other']),
    name: z.string().min(1, { message: 'お名前を入力してください' }),
    email: z.string().email({ message: '正しいメールアドレスを入力してください' }),
    message: z.string().min(1, { message: 'メッセージを入力してください' }),
})

// -----------------------------------------------------------------------------
// Server Actions
// -----------------------------------------------------------------------------

type FormState = {
    success: boolean
    message: string
    errors?: Record<string, string[] | undefined>
}

/**
 * ユーザーからのお問い合わせを受け取る (Submit Inquiry)
 */
export async function submitInquiry(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        // 1. バリデーション (門番)
        // categoryを強引にstringとして扱うことでenumエラーを回避
        const rawData = {
            category: String(formData.get('category')),
            name: String(formData.get('name')),
            email: String(formData.get('email')),
            message: String(formData.get('message')),
        }

        // safeParseを使うことで、エラーハンドリングをより堅牢に
        const validationResult = inquirySchema.safeParse(rawData)

        if (!validationResult.success) {
            const errors = validationResult.error.flatten().fieldErrors
            // エラーメッセージの取得ロジック
            let firstMessage = '入力内容を確認してください。'
            const errorValues = Object.values(errors)
            if (errorValues.length > 0 && errorValues[0] && errorValues[0].length > 0) {
                firstMessage = errorValues[0][0]
            }

            return {
                success: false,
                message: firstMessage,
                errors: errors
            }
        }

        const validatedData = validationResult.data

        // 2. データベースへの保存 (刻印)
        const supabase = createClient()
        const { error } = await supabase.from('inquiries').insert({
            category: validatedData.category,
            name: validatedData.name,
            email: validatedData.email,
            message: validatedData.message,
        })

        if (error) {
            console.error('Inquiry Insert Error:', error)
            return { success: false, message: '送信に失敗しました。時間をおいて再度お試しください。' }
        }

        // 3. 成功 (凱歌)
        return { success: true, message: 'お問い合わせを受け付けました！' }

    } catch (error) {
        console.error('Unexpected Error:', error)
        return { success: false, message: '予期せぬエラーが発生しました。' }
    }
}

/**
 * 管理者: お問い合わせ一覧を取得する (Get All)
 */
export async function getInquiries() {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Fetch Error:', error)
        throw new Error('お問い合わせの取得に失敗しました')
    }

    return data
}

/**
 * 管理者: ステータスを更新する (Update Status)
 */
export async function updateInquiryStatus(id: string, status: 'pending' | 'done') {
    const supabase = createClient()

    const { error } = await supabase
        .from('inquiries')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        console.error('Update Error:', error)
        return { success: false, message: 'ステータスの更新に失敗しました' }
    }

    revalidatePath('/admin/inquiries')
    return { success: true, message: 'ステータスを更新しました' }
}
