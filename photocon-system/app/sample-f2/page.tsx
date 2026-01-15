import { HeroF2 } from '@/components/f2/HeroF2'
import { ActiveEventF2 } from '@/components/f2/ActiveEventF2'
import { PastEventsF2 } from '@/components/f2/PastEventsF2'
import { HowToApplyF2 } from '@/components/f2/HowToApplyF2'
import { FAQF2 } from '../../components/f2/FAQF2'
import { PrizesF2 } from '@/components/f2/PrizesF2'
import { RequirementsF2 } from '@/components/f2/RequirementsF2'
import Link from 'next/link'
import Image from 'next/image'

export default function SampleF2Page() {
    return (
        <main className="min-h-screen bg-white font-sans overflow-x-hidden pt-20">
            {/* Header - Simple Version for Sample F-2 */}
            {/* Header - Simple Version for Sample F-2 */}
            <header className="bg-white/90 backdrop-blur-md text-gray-800 py-4 px-6 md:px-12 flex justify-between items-center fixed top-0 w-full z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="スクールフォト!"
                            width={180}
                            height={40}
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>
                <nav className="hidden md:flex gap-6 font-bold text-sm tracking-wider">
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">イベント</Link>
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">応募方法</Link>
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">募集要項</Link>
                    <Link href="#" className="hover:text-[#E75D2E] transition-colors">写真ギャラリー</Link>
                </nav>
                <div className="flex gap-4">
                    <button className="bg-[#E75D2E] text-white px-6 py-2 rounded-full font-bold hover:bg-[#c9451b] transition-colors shadow-md">
                        ログイン | 応募
                    </button>
                </div>
            </header>

            <HeroF2 />

            <ActiveEventF2 />
            <PastEventsF2 />
            <HowToApplyF2 />
            <FAQF2 />
            <div className="mt-24 md:mt-40">
                <PrizesF2 />
            </div>
            <RequirementsF2 />

            {/* Footer space */}
            <div className="pb-20 bg-[#FFF5F0]"></div>

        </main>
    )
}
