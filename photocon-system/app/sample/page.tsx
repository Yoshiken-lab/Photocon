import { Hero } from '@/components/Hero'
import { ActiveEvent } from '@/components/ActiveEvent'
import { PastEvents } from '@/components/PastEvents'
import { HowToApply } from '@/components/HowToApply'
import { Prizes } from '@/components/Prizes'
import { SampleFAQ } from '@/components/sample/SampleFAQ'
import Image from 'next/image'
import Link from 'next/link'

export default function SamplePage() {
    return (
        <main className="min-h-screen bg-brand-50 font-sans">
            {/* Sample Header (Simplified) */}
            <header className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="スクールフォト!"
                            width={160}
                            height={40}
                            className="h-8 md:h-10 w-auto"
                        />
                    </Link>
                </div>
                <div className="flex gap-4">
                    <button className="bg-brand text-white px-4 py-2 md:px-8 md:py-3 rounded-full font-bold hover:bg-brand-600 transition-colors text-sm md:text-base border-2 border-white shadow-md">
                        ログイン | 応募
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <Hero />

            {/* Active Event Section */}
            <ActiveEvent />

            {/* Past Events & How To Apply Container */}
            <PastEvents />

            <HowToApply />

            <Prizes />

            <SampleFAQ />

        </main>
    )
}
