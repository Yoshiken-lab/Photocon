'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateSystemSetting } from '@/lib/system-settings'

interface Props {
    initialIsEnabled: boolean
}

export default function AuthModeToggle({ initialIsEnabled }: Props) {
    const router = useRouter()
    const [isEnabled, setIsEnabled] = useState(initialIsEnabled)
    const [loading, setLoading] = useState(false)

    const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked
        setIsEnabled(newValue)
        setLoading(true)

        try {
            await updateSystemSetting('is_auth_enabled', String(newValue))
            router.refresh()
        } catch (error) {
            console.error('Failed to update auth mode:', error)
            // Revert on error
            setIsEnabled(!newValue)
            alert('設定の更新に失敗しました。')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl p-6 border-2 border-brand/20 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🔒</span>
                        <h3 className="text-xl font-bold text-gray-800">アカウント認証</h3>
                    </div>
                    <p className="text-gray-600 text-sm ml-12 leading-relaxed">
                        ONに設定すると、応募やマイページへのアクセスに<br />
                        <span className="font-bold text-brand">アカウント登録およびログインが必須</span>となります。
                    </p>
                </div>

                <div className="flex items-center gap-4 pl-4">
                    <span className={`text-sm font-bold transition-colors ${!isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>OFF</span>

                    <label className="relative inline-flex items-center cursor-pointer w-[60px] h-[32px]">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={handleToggle}
                            disabled={loading}
                        />
                        <div className="w-full h-full bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/30 rounded-full peer peer-checked:after:translate-x-[28px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[24px] after:w-[24px] after:transition-all peer-checked:bg-brand"></div>
                    </label>

                    <span className={`text-sm font-bold transition-colors ${isEnabled ? 'text-brand' : 'text-gray-400'}`}>ON</span>
                </div>
            </div>

            {/* Status Indicator & Loading State */}
            <div className="mt-4 pt-4 border-t border-brand/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    {isEnabled ? (
                        <>
                            <span className="w-3 h-3 rounded-full bg-brand animate-pulse"></span>
                            <span className="text-brand">現在: <span className="font-bold">ログイン必須</span>（アカウント登録が必要）</span>
                        </>
                    ) : (
                        <>
                            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                            <span className="text-gray-500">現在: <span className="font-bold">匿名利用</span>（ログイン不要）</span>
                        </>
                    )}
                </div>

                {loading && (
                    <div className="flex items-center gap-1 text-xs text-brand animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>更新中...</span>
                    </div>
                )}
            </div>
        </div>
    )
}
