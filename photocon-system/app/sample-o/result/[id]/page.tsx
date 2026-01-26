import { getEntriesForResult, getContestById } from '@/app/actions/sample-o'
import ResultClientO from './ResultClientO'

export const dynamic = 'force-dynamic'

export default async function ResultPageO({ params }: { params: { id: string } }) {
    // Fetch real data from Server Action
    const entries = await getEntriesForResult(params.id)
    const contest = await getContestById(params.id)

    // Determine if voting is open
    // Voting is open if status is 'voting' OR 'active' (if concurrent)
    // For safety, let's assume 'voting' is the main status, but maybe 'active' allows it too depending on requirements.
    // However, the user specifically complained about "past" events (status='ended').
    // So we definitely disable if status is 'ended' or 'draft'.

    // Check dates if available?
    const now = new Date()
    let isVotingOpen = false

    if (contest) {
        if (contest.status === 'voting') {
            isVotingOpen = true
        } else if (contest.status === 'active') {
            // If active usually means submission, maybe voting is not yet? 
            // But let's assume voting might overlap.
            // Safer check: voting_start <= now <= voting_end
            if (contest.voting_start && contest.voting_end) {
                const start = new Date(contest.voting_start)
                const end = new Date(contest.voting_end)
                isVotingOpen = now >= start && now <= end
            }
        }
        // Explicitly closed for 'ended'
    }

    // Map the DB entry format to the Client Component's expected interface if necessary
    // Currently they match closely: { id, media_url, username, caption, collected_at }

    return <ResultClientO entries={entries as any} isVotingOpen={isVotingOpen} />
}
