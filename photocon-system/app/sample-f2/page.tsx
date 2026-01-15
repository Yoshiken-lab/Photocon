import { HeroF2 } from '@/components/f2/HeroF2'
import { ActiveEventF2 } from '@/components/f2/ActiveEventF2'
import { PastEventsF2 } from '@/components/f2/PastEventsF2'
import { HowToApplyF2 } from '@/components/f2/HowToApplyF2'
import { FAQF2 } from '../../components/f2/FAQF2'
import { PrizesF2 } from '@/components/f2/PrizesF2'
import { RequirementsF2 } from '@/components/f2/RequirementsF2'
import Link from 'next/link'
import Image from 'next/image'

import { HeaderF2 } from '@/components/f2/HeaderF2'
import { FooterF2 } from '@/components/f2/FooterF2'

export default function SampleF2Page() {
    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Header - Simple Version for Sample F-2 */}
            <HeaderF2 />

            <HeroF2 />

            <ActiveEventF2 />
            <PastEventsF2 />
            <HowToApplyF2 />
            <FAQF2 />
            <PrizesF2 />
            <RequirementsF2 />

            <FooterF2 />
        </main>
    )
}
