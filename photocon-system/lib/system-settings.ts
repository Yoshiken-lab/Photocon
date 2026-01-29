'use server'

import { createServerClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

/**
 * システム設定を取得する（サーバーサイド用）
 * @param key 設定キー
 * @param defaultValue デフォルト値
 */
export async function getSystemSetting(key: string, defaultValue: string = ''): Promise<string> {
    const supabase = createServerClient()

    try {
        const { data, error } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', key)
            .single()

        if (error) {
            console.warn(`[SystemSettings] Failed to fetch key "${key}":`, error.message)
            return defaultValue
        }

        return data?.value ?? defaultValue
    } catch (e) {
        console.error(`[SystemSettings] Exception fetching key "${key}":`, e)
        return defaultValue
    }
}

/**
 * システム設定を更新する（Server Action用）
 * @param key 設定キー
 * @param value 設定値
 */
export async function updateSystemSetting(key: string, value: string) {
    // 書き込みには特権クライアント（Service Role）を使用
    // これにより、匿名ユーザー（管理者だがログインしていない状態）でも設定変更が可能になる
    const supabase = createServiceRoleClient()

    const { error } = await supabase
        .from('system_settings')
        .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
        })

    if (error) {
        throw new Error(`Failed to update setting "${key}": ${error.message}`)
    }

    // 設定変更後はキャッシュをクリアして即座に反映させる
    revalidatePath('/', 'layout')

    return { success: true }
}
