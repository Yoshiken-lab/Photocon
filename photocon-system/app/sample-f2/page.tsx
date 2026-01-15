import { HeroF2 } from '@/components/f2/HeroF2'
import { ActiveEventF2 } from '@/components/f2/ActiveEventF2'
import { PastEventsF2 } from '@/components/f2/PastEventsF2'
import { HowToApplyF2 } from '@/components/f2/HowToApplyF2'
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
                        {/* Assuming white logo variant or using text if not available, will use filter for now or just text if logo is image */}
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Image
                                src="/logo.png"
                                alt="スクールフォト!"
                                width={120}
                                height={30}
                                className="h-8 w-auto brightness-0 invert"
                            />
                        </div>
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
            <PrizesF2 />
            <RequirementsF2 />

            {/* Footer space */}
            <div className="pb-20 bg-[#FFF5F0]"></div>

        </main>
    )
}
