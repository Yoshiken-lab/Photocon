'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { requestDeletion } from './delete-request/action'

interface Entry {
    id: string
    media_url: string
    caption: string | null
    status: string
    created_at: string
    contests: { name: string } | null
    rejection_reason?: string | null
}

interface Props {
    user: any
    entries: Entry[]
    stats: { total: number; approved: number }
}

export default function ClientMyPage({ user, entries, stats }: Props) {
    const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [deleteReason, setDeleteReason] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const openDeleteModal = (entry: Entry) => {
        setSelectedEntry(entry)
        setIsModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsModalOpen(false)
        setSelectedEntry(null)
        setDeleteReason('')
    }

    const handleSubmitDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEntry) return

        setIsLoading(true)
        try {
            // Server Action to handle inquiry creation
            const result = await requestDeletion({
                entryId: selectedEntry.id,
                contestName: selectedEntry.contests?.name || '不明なコンテスト',
                reason: deleteReason,
                userEmail: user.email
            })

            if (result.success) {
                alert('削除依頼を送信しました！事務局からの連絡をお待ちください。')
                closeDeleteModal()
            } else {
                alert('送信に失敗しました: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('エラーが発生しました。')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pt-10 pb-20">

            {/* Profile Section */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-3xl shadow-inner">
                        👶
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl md:text-3xl font-maru font-bold text-gray-800 mb-2">
                            ようこそ、<span className="text-brand">{user.email?.split('@')[0]}</span>さん！
                        </h1>
                        <p className="text-gray-500">あなたの投稿した写真の管理やステータス確認ができます。</p>
                    </div>
                    <div className="flex gap-6 divide-x divide-gray-200 bg-gray-50 p-4 rounded-2xl">
                        <div className="text-center px-2">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">応募数</p>
                            <p className="text-2xl font-bold text-brand">{stats.total}</p>
                        </div>
                        <div className="text-center px-2">
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">承認/入賞</p>
                            <p className="text-2xl font-bold text-brand">{stats.approved}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Entries List */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-maru font-bold flex items-center gap-2">
                    <span className="w-2 h-8 bg-brand rounded-full inline-block"></span>
                    応募履歴
                </h2>
            </div>

            <div className="space-y-4">
                {entries.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">まだ応募履歴がありません。</p>
                        <Link href="/sample-o#howto" className="text-brand font-bold hover:underline">
                            👉 コンテストに応募してみる？
                        </Link>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
                            <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-xl overflow-hidden relative group shrink-0">
                                <img src={entry.media_url} alt="Entry" className={`w-full h-full object-cover transition-transform duration-500 ${entry.status === 'rejected' ? 'grayscale' : 'group-hover:scale-105'}`} />
                                {entry.status === 'pending' && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <span className="text-white font-maru font-bold drop-shadow-md">審査中</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{entry.contests?.name || '不明なコンテスト'}</h3>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${entry.status === 'approved' || entry.status === 'winner' ? 'bg-green-100 text-green-700' :
                                                entry.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {entry.status === 'approved' ? '承認済' :
                                                entry.status === 'winner' ? '入賞！' :
                                                    entry.status === 'rejected' ? '却下' : '審査中'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1 line-clamp-1">{entry.caption || '（タイトルなし）'}</p>
                                    <p className="text-gray-400 text-xs">応募日: {new Date(entry.created_at).toLocaleDateString('ja-JP')}</p>
                                </div>

                                <div className="mt-3 flex justify-between items-center border-t border-gray-50 pt-2">
                                    {entry.status === 'rejected' ? (
                                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded w-full">
                                            理由: {entry.rejection_reason || '規定を満たしていません'}
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => openDeleteModal(entry)} className="text-gray-400 hover:text-red-500 text-xs font-medium underline flex items-center gap-1 transition-colors">
                                                🗑️ 削除を依頼する
                                            </button>
                                            {(entry.status === 'approved' || entry.status === 'winner') && (
                                                <span className="text-brand text-xs font-bold flex items-center gap-1">
                                                    公開中 ✨
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Delete Modal */}
            {isModalOpen && selectedEntry && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-maru font-bold text-gray-800 mb-4">写真の削除を依頼しますか？</h3>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600">
                            <p className="font-bold text-gray-800 mb-1">{selectedEntry.contests?.name}</p>
                            <p>{selectedEntry.caption || '（タイトルなし）'}</p>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            削除依頼を送信すると、運営事務局にて確認後、削除処理が行われます。
                            <br /><span className="text-red-500 font-bold text-xs">※ この操作は取り消せません。</span>
                        </p>

                        <form onSubmit={handleSubmitDelete}>
                            <label className="block text-sm font-bold text-gray-700 mb-1">削除理由（任意）</label>
                            <textarea
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                                rows={3}
                                placeholder="例：間違えて投稿してしまったため"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                            ></textarea>

                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={closeDeleteModal} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                                    キャンセル
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors flex items-center justify-center gap-2">
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    削除を依頼する
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
