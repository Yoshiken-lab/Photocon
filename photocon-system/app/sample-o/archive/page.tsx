import { getPastContests } from '@/app/actions/sample-o'
import ArchiveClientO from './ArchiveClientO'

export const dynamic = 'force-dynamic'

export default async function ArchivePageO() {
    const contests = await getPastContests()
    console.log('--- [DEBUG] ARCHIVE PAGE FETCH START ---')
    console.log('Fetched Contests Count:', contests.length)
    console.log('First Contest:', contests[0] ? JSON.stringify(contests[0]) : 'None')
    console.log('--- [DEBUG] ARCHIVE PAGE FETCH END ---')

    return <ArchiveClientO contests={contests as any} />
}
