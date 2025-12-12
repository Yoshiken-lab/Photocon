'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentStatus?: string
}

export function StatusFilter({ currentStatus }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleStatusChange = (status?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status) {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.push(`/admin/entries?${params.toString()}`)
  }

  const statuses = [
    { value: '', label: 'すべて' },
    { value: 'pending', label: '審査中' },
    { value: 'approved', label: '承認済' },
    { value: 'rejected', label: '却下' },
  ]

  return (
    <div className="flex gap-2 mb-6">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => handleStatusChange(status.value || undefined)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            (currentStatus || '') === status.value
              ? 'bg-brand text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  )
}
