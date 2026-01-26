import { getPastContests } from '@/app/actions/sample-o'
import ArchiveClientO from './ArchiveClientO'

export const dynamic = 'force-dynamic'

export default async function ArchivePageO() {
    const contests = await getPastContests()

    return <ArchiveClientO contests={contests as any} />
}
