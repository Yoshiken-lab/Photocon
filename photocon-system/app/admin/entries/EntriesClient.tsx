'use client'

import { useRouter } from 'next/navigation'
import { EntryTable } from '@/components/admin'
import { updateEntryStatus } from '@/app/actions/entries'
import type { Entry } from '@/types/entry'

interface Props {
  entries: Entry[]
}

export function EntriesClient({ entries }: Props) {
  const router = useRouter()

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    await updateEntryStatus(id, status)
    router.refresh()
  }

  return (
    <EntryTable entries={entries} onStatusChange={handleStatusChange} />
  )
}
