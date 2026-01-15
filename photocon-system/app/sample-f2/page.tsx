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
        <main className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Header - Simple Version for Sample F-2 */}
            <header className="bg-brand text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
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
                    <Link href="#" className="hover:text-yellow-300 transition-colors">イベント</Link>
                    <Link href="#" className="hover:text-yellow-300 transition-colors">応募方法</Link>
                    <Link href="#" className="hover:text-yellow-300 transition-colors">募集要項</Link>
                    <Link href="#" className="hover:text-yellow-300 transition-colors">写真ギャラリー</Link>
                </nav>
                <div className="flex gap-4">
                    <button className="bg-white text-brand px-6 py-2 rounded-full font-bold hover:bg-yellow-100 transition-colors shadow-sm border-2 border-transparent hover:border-white">
                        ログイン | 応募
                    </button>
                </div>
            </header>

            <HeroF2 />

            <ActiveEventF2 />
            <PastEventsF2 />
            <HowToApplyF2 />
            <FAQF2 />
            <PrizesF2 />
            <RequirementsF2 />

            {/* Footer space */}
            <div className="pb-20 bg-[#FFF5F0]"></div>

        </main>
    )
}
