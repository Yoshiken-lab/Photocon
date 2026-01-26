'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, Circle, RefreshCw } from 'lucide-react'
import { updateInquiryStatus } from '@/app/actions/inquiry'

type Props = {
    id: string
    currentStatus: 'pending' | 'done'
}

export function StatusButton({ id, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition()
    // 楽観的UIもどき（実際はServer Action完了後に再描画されるが、ボタン自体の反応速度向上のため）
    const [optimisticStatus, setOptimisticStatus] = useState(currentStatus)

    const isDone = optimisticStatus === 'done'

    const toggleStatus = () => {
        const newStatus = isDone ? 'pending' : 'done'
        setOptimisticStatus(newStatus)

        startTransition(async () => {
            const result = await updateInquiryStatus(id, newStatus)
            if (!result.success) {
                // 失敗したら戻す
                setOptimisticStatus(currentStatus)
                alert(result.message)
            }
        })
    }

    return (
        <button
            onClick={toggleStatus}
            disabled={isPending}
            className={`
        relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all
        ${isDone
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200'
                }
        ${isPending ? 'opacity-70 cursor-wait' : ''}
      `}
        >
            {isPending ? (
                <RefreshCw size={14} className="animate-spin" />
            ) : isDone ? (
                <CheckCircle size={14} />
            ) : (
                <Circle size={14} />
            )}

            <span>
                {isDone ? '対応完了' : '未対応'}
            </span>
        </button>
    )
}
