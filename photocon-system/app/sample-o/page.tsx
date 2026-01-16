import { HeaderO } from '@/components/o/HeaderO'
import { LayoutO } from '@/components/o/LayoutO'
import { HeroO } from '@/components/o/HeroO'
import { HowToApplyO } from '@/components/o/HowToApplyO'
import { ActiveEventsO } from '@/components/o/ActiveEventsO'
import { FAQO } from '@/components/o/FAQO'
import { FooterO } from '@/components/o/FooterO'

export default function SampleOPage() {
    return (
        <main className="font-sans antialiased text-text-main">
            <HeaderO />
            <LayoutO>
                <HeroO />
                <HowToApplyO />
                <ActiveEventsO />
                <FAQO />
                <FooterO />
            </LayoutO>
        </main>
    )
}
