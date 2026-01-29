'use client'

import { useState } from 'react'
import { UserX, Clock, CheckCircle, XCircle, AlertTriangle, Loader2, Copy, Check } from 'lucide-react'
import { processAccountDeletion } from './action'

type AccountDeletionRequest = {
    id: string
    user_id: string
    user_email: string
    reason: string | null
    status: 'pending' | 'approved' | 'rejected'
    requested_at: string
    processed_at: string | null
    processed_by: string | null
}

type Props = {
    initialRequests: AccountDeletionRequest[]
}

const statusConfig = {
    pending: {
        label: '未対応',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
    },
    approved: {
        label: '承認済（削除完了）',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
    },
    rejected: {
        label: '却下',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
    },
}

export function AccountDeletionList({ initialRequests }: Props) {
    const [requests, setRequests] = useState(initialRequests)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

    // 集計
    const total = requests.length
    const pending = requests.filter(r => r.status === 'pending').length

    const handleProcess = async (requestId: string, action: 'approve' | 'reject') => {
        if (!confirm(action === 'approve'
            ? '本当にこのアカウントを削除しますか？\n※ この操作は取り消せません。'
            : 'この申請を却下しますか？'
        )) return

        setProcessingId(requestId)
        try {
            const result = await processAccountDeletion(requestId, action)
            if (result.success) {
                // ステータスをローカルで更新
                setRequests(prev => prev.map(r =>
                    r.id === requestId
                        ? { ...r, status: action === 'approve' ? 'approved' as const : 'rejected' as const, processed_at: new Date().toISOString() }
                        : r
                ))
            } else {
                alert('エラー: ' + result.error)
            }
        } catch (error) {
            console.error(error)
            alert('処理中にエラーが発生しました')
        } finally {
            setProcessingId(null)
        }
    }

    const copyEmail = (email: string) => {
        navigator.clipboard.writeText(email)
        setCopiedEmail(email)
        setTimeout(() => setCopiedEmail(null), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserX className="text-red-500" />
                        アカウント削除申請
                    </h1>
                    <p className="text-gray-500 mt-1">
                        ユーザーからのアカウント削除申請を確認・処理します
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                        <span className="text-sm font-bold text-gray-600">未対応: {pending}件</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
                        <span className="text-sm text-gray-400">総件数: {total}件</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {requests.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {requests.map((request) => {
                            const StatusIcon = statusConfig[request.status].icon
                            return (
                                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">

                                        {/* Left: Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1 ${statusConfig[request.status].color}`}>
                                                    <StatusIcon size={12} />
                                                    {statusConfig[request.status].label}
                                                </span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(request.requested_at).toLocaleString('ja-JP')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-gray-800">{request.user_email}</h3>
                                                <button
                                                    onClick={() => copyEmail(request.user_email)}
                                                    className="text-gray-400 hover:text-brand transition-colors p-1 rounded hover:bg-gray-100"
                                                    title="メールアドレスをコピー"
                                                >
                                                    {copiedEmail === request.user_email ? (
                                                        <Check size={14} className="text-green-500" />
                                                    ) : (
                                                        <Copy size={14} />
                                                    )}
                                                </button>
                                            </div>

                                            {request.reason && (
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2 text-sm text-gray-700">
                                                    <span className="text-xs text-gray-400 block mb-1">削除理由:</span>
                                                    {request.reason}
                                                </div>
                                            )}

                                            {request.processed_at && (
                                                <p className="text-xs text-gray-400 mt-2">
                                                    処理日時: {new Date(request.processed_at).toLocaleString('ja-JP')}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-col gap-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleProcess(request.id, 'approve')}
                                                        disabled={processingId === request.id}
                                                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        {processingId === request.id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <CheckCircle size={14} />
                                                        )}
                                                        承認（削除実行）
                                                    </button>
                                                    <button
                                                        onClick={() => handleProcess(request.id, 'reject')}
                                                        disabled={processingId === request.id}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        <XCircle size={14} />
                                                        却下
                                                    </button>
                                                </>
                                            )}
                                            {request.status === 'approved' && (
                                                <div className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                    <CheckCircle size={14} />
                                                    削除完了
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>アカウント削除申請はまだありません</p>
                    </div>
                )}
            </div>
        </div>
    )
}
