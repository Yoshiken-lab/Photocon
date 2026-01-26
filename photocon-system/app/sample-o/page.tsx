import { HeaderO } from '@/components/o/HeaderO'
import { LayoutO } from '@/components/o/LayoutO'
import { HeroO } from '@/components/o/HeroO'
import { HowToApplyO } from '@/components/o/HowToApplyO'
import { ActiveEventsO } from '@/components/o/ActiveEventsO'
import { FAQO } from '@/components/o/FAQO'
import { FooterO } from '@/components/o/FooterO'
import { getActiveContests, getPastContests } from '@/app/actions/sample-o'

export default async function SampleOPage() {
    const activeContests = await getActiveContests()
    const pastContests = await getPastContests()

    return (
        <main className="font-sans antialiased text-text-main">
            <HeaderO />
            <LayoutO>
                <HeroO />
                <HowToApplyO />
                <ActiveEventsO activeContests={activeContests as any} pastContests={pastContests as any} />
                <FAQO />
                <FooterO />
            </LayoutO>
        </main>
    )
}
