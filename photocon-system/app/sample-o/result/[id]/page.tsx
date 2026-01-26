import { getEntriesForResult } from '@/app/actions/sample-o'
import ResultClientO from './ResultClientO'

export const dynamic = 'force-dynamic'

export default async function ResultPageO({ params }: { params: { id: string } }) {
    // Fetch real data from Server Action
    const entries = await getEntriesForResult(params.id)

    // Map the DB entry format to the Client Component's expected interface if necessary
    // Currently they match closely: { id, media_url, username, caption, collected_at }

    return <ResultClientO entries={entries as any} />
}
