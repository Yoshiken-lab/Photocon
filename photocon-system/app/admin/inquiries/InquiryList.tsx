'use client'

import { useState, useEffect } from 'react'
import { Mail, Clock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { StatusButton } from './StatusButton'

// 型定義
type Inquiry = {
    id: string
    category: string
    name: string
    email: string
    message: string
    status: 'pending' | 'done'
    created_at: string
    updated_at: string
}

type Props = {
    initialInquiries: Inquiry[]
}

// カテゴリラベルのマッピング
const categoryLabels: Record<string, string> = {
    contest: 'フォトコンテストについて',
    delete: '投稿写真の削除依頼',
    system: 'システム不具合報告',
    other: 'その他・ご感想',
}

// カテゴリバッジの色
const categoryColors: Record<string, string> = {
    contest: 'bg-blue-50 text-blue-700 border-blue-200',
    delete: 'bg-red-50 text-red-700 border-red-200',
    system: 'bg-purple-50 text-purple-700 border-purple-200',
    other: 'bg-gray-50 text-gray-700 border-gray-200',
}

export function InquiryList({ initialInquiries }: Props) {
    const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
    const supabase = createClient()

    // 集計
    const total = inquiries.length
    const pending = inquiries.filter(i => i.status === 'pending').length

    useEffect(() => {
        // リストの同期 (initialInquiriesが変わったらstateも更新)
        setInquiries(initialInquiries)
    }, [initialInquiries])

    useEffect(() => {
        const channel = supabase
            .channel('inquiries-list-updates')
            .on(
                'postgres_changes',
                {
                    event: '*', // すべてのイベント (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'inquiries',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        // 新しい問い合わせを先頭に追加
                        const newInquiry = payload.new as Inquiry
                        setInquiries((prev) => [newInquiry, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        // ステータス更新などを反映
                        const updatedInquiry = payload.new as Inquiry
                        setInquiries((prev) =>
                            prev.map((item) => (item.id === updatedInquiry.id ? updatedInquiry : item))
                        )
                    } else if (payload.eventType === 'DELETE') {
                        // 削除されたものをリストから除外
                        const deletedId = payload.old.id
                        setInquiries((prev) => prev.filter(item => item.id !== deletedId))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Mail className="text-[#E84D1C]" />
                        お問い合わせ
                    </h1>
                    <p className="text-gray-500 mt-1">
                        ユーザーからのメッセージを確認・管理します
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
                {inquiries.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start justify-between gap-4">

                                    {/* Left: Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${categoryColors[inquiry.category] || categoryColors.other}`}>
                                                {categoryLabels[inquiry.category] || inquiry.category}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(inquiry.created_at).toLocaleString('ja-JP')}
                                            </span>
                                            {/* NEW Badge Logic (簡易的に、現在時刻から1分以内のものとかにNEWをつけるなども可能だが、今回はリアルタイム追加時のアニメーションで表現済み) */}
                                        </div>

                                        <h3 className="font-bold text-gray-800 mb-1">{inquiry.name} <span className="text-xs font-normal text-gray-400 ml-1">&lt;{inquiry.email}&gt;</span></h3>

                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {inquiry.message}
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex flex-col items-end gap-2">
                                        <StatusButton id={inquiry.id} currentStatus={inquiry.status} />
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>お問い合わせはまだありません</p>
                    </div>
                )}
            </div>
        </div>
    )
}
