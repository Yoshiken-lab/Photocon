import { getEntriesForResult, getContestById } from '@/app/actions/sample-o'
import ResultClientO from './ResultClientO'

export const dynamic = 'force-dynamic'

export default async function ResultPageO({ params }: { params: { id: string } }) {
    const contest = await getContestById(params.id)

    if (!contest) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">コンテストが見つかりません</div>
    }

    const now = new Date()
    const startDate = new Date(contest.start_date)
    const endDate = new Date(contest.end_date)
    const votingStart = contest.voting_start ? new Date(contest.voting_start) : null
    const votingEnd = contest.voting_end ? new Date(contest.voting_end) : null

    // Determine period
    const isBeforeStart = now < startDate
    const isAfterEnd = now > endDate
    const isSubmissionPeriod = now >= startDate && now <= endDate
    const isVotingPeriod = votingStart && votingEnd && now >= votingStart && now <= votingEnd
    const isVotingEnabled = (contest.settings as any)?.is_voting_enabled !== false

    // Gallery visibility: Show during submission, voting, and after (but not before start, not draft)
    const isGalleryVisible = !isBeforeStart && contest.status !== 'draft'

    if (!isGalleryVisible) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">ギャラリーはまだ公開されていません</div>
    }

    // Determine voting status
    const isVotingOpen = isVotingEnabled && !!isVotingPeriod

    // For submission period, include pending entries too (gallery mode)
    const includeAllVisible = isSubmissionPeriod && !isVotingPeriod
    const entries = await getEntriesForResult(params.id, includeAllVisible)

    // Voting hint for submission period
    const votingHint = isSubmissionPeriod && !isVotingPeriod && votingStart
        ? `投票は ${votingStart.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })} から開始！`
        : null

    return (
        <ResultClientO
            entries={entries as any}
            isVotingOpen={isVotingOpen}
            contestShortCode={contest.short_code || null}
            votingHint={votingHint}
        />
    )
}
