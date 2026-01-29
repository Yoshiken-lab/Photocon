'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { requestDeletion } from './delete-request/action'
import { requestAccountDeletion, getMyDeletionRequest, type DeletionRequestStatus } from './account-deletion/action'

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

    // Account Deletion States
    // Account Deletion States
    const [isAccountDeleteModalOpen, setIsAccountDeleteModalOpen] = useState(false)
    const [accountDeleteReason, setAccountDeleteReason] = useState('')
    const [isAccountDeleteLoading, setIsAccountDeleteLoading] = useState(false)
    const [deletionRequestStatus, setDeletionRequestStatus] = useState<DeletionRequestStatus>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch existing deletion request status on mount
    useEffect(() => {
        getMyDeletionRequest().then(result => {
            setDeletionRequestStatus(result.status)
        })
    }, [])

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

    const handleAccountDeletionRequest = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsAccountDeleteLoading(true)
        try {
            const result = await requestAccountDeletion(accountDeleteReason)
            if (result.success) {
                alert('アカウント削除申請を送信しました。運営事務局での確認後、削除処理が行われます。')
                setIsAccountDeleteModalOpen(false)
                setAccountDeleteReason('')
                setDeletionRequestStatus('pending')
            } else {
                alert('送信に失敗しました: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('エラーが発生しました。')
        } finally {
            setIsAccountDeleteLoading(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pt-10 pb-20">

            {/* Deletion Request Pending Banner */}
            {deletionRequestStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                    <div>
                        <p className="font-bold text-yellow-800">アカウント削除を申請中です</p>
                        <p className="text-sm text-yellow-700">運営事務局にて確認中です。しばらくお待ちください。</p>
                    </div>
                </div>
            )}

            {/* Profile Section */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
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

            {/* ========== Account Settings ========== */}
            {/* ========== Account Settings ========== */}
            <div className="mt-16">
                <h2 className="text-xl font-maru font-bold flex items-center gap-2 mb-6">
                    <span className="w-2 h-8 bg-brand rounded-full inline-block"></span>
                    アカウント設定
                </h2>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    {/* Withdrawal Section */}
                    {deletionRequestStatus === 'pending' ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="font-bold text-yellow-800 flex items-center gap-2 mb-1">
                                <AlertTriangle className="w-4 h-4" />
                                退会手続き中
                            </p>
                            <p className="text-sm text-yellow-700">運営事務局にて確認中です。しばらくお待ちください。</p>
                        </div>
                    ) : (
                        <div className="pt-2">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="font-bold text-gray-700 mb-2">退会について</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        サービスのご利用ありがとうございました。<br />
                                        退会手続きを行うと、マイページへのログインができなくなります。<br />
                                        <span className="text-gray-400 text-xs mt-1 block">※ ご投稿いただいた写真は「ゲスト投稿」としてギャラリーに残ります。</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsAccountDeleteModalOpen(true)}
                                    className="shrink-0 border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                                >
                                    退会手続きへ進む
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Entry Delete Modal */}
            {mounted && isModalOpen && selectedEntry && createPortal(
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-maru font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-brand" />
                            投稿の削除依頼
                        </h3>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">以下の投稿の削除を依頼しますか？</p>
                            <div className="bg-gray-50 p-2 rounded flex items-center gap-3">
                                <img src={selectedEntry.media_url} alt="Selected" className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{selectedEntry.contests?.name}</p>
                                    <p className="text-xs text-gray-500">{new Date(selectedEntry.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                キャンセル
                            </button>
                            <a
                                href={`mailto:camera@shichigosan-honpo.com?subject=【削除依頼】投稿ID:${selectedEntry.id}&body=投稿の削除を依頼します。%0D%0A%0D%0A投稿ID: ${selectedEntry.id}%0D%0A理由:`}
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
                            >
                                運営にメールを送る
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Account Deletion Modal (Revised) */}
            {mounted && isAccountDeleteModalOpen && createPortal(
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-maru font-bold text-gray-800 mb-4 text-center">退会手続き</h3>

                        <p className="text-sm text-gray-600 mb-6 leading-relaxed text-center">
                            これまでのご利用、誠にありがとうございました。<br />
                            本当に退会されますか？
                        </p>

                        <form onSubmit={handleAccountDeletionRequest}>
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-2">退会理由（任意）</label>
                                <textarea
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-brand transition-colors"
                                    rows={3}
                                    placeholder="今後のサービス向上のため、よろしければ理由をお聞かせください"
                                    value={accountDeleteReason}
                                    onChange={(e) => setAccountDeleteReason(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsAccountDeleteModalOpen(false); setAccountDeleteReason('') }}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAccountDeleteLoading}
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-red-400 hover:bg-red-500 shadow-md transition-colors flex items-center justify-center gap-2"
                                >
                                    {isAccountDeleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    退会を申請する
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

        </div>
    )
}


