'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const supabase = createClient()
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=${next}`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else if (data.user && !data.session) {
            // Email confirmation required
            setMessage('確認メールを送信したぜ！メール内のリンクをクリックして登録を完了させてくれ！')
            setLoading(false)
        } else {
            // Auto signed in (if email confirm disabled)
            router.push(next)
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
                {/* Decorative Header */}
                <div className="bg-yellow-400 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
                    <Sparkles className="w-16 h-16 text-yellow-900 mx-auto mb-2 relative z-10 animate-bounce" />
                    <h1 className="text-2xl font-bold text-yellow-900 relative z-10 font-maru">新規メンバー登録！</h1>
                    <p className="text-yellow-800 text-sm mt-1 relative z-10">
                        新しい仲間の登場だ！<br />さあ、伝説の始まりだ！
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center font-bold">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-4 text-center font-bold">
                            {message}
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">メールアドレス</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
                                    placeholder="star@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">パスワード</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-400 text-yellow-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        登録して突撃する
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-500">
                        すでにアカウントを持ってるなら、<br />
                        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-yellow-600 font-bold hover:underline inline-flex items-center gap-1 mt-1">
                            こっちからログインだ！
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
