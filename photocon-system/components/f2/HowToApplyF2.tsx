'use client'

import { Image as ImageIcon, UploadCloud, Heart } from 'lucide-react'

export function HowToApplyF2() {
    return (
        <section className="bg-[#FFF5F0] py-20 px-4 relative overflow-hidden">

            {/* Top Curve (White -> Pink) - Optional or just straight cut */}
            {/* We can add a top svg if needed, but standard block is fine based on image */}

            <div className="max-w-6xl mx-auto text-center">

                {/* Title Area */}
                <div className="mb-16 relative">
                    {/* "Easy 3 Steps" Badge */}
                    <div className="inline-block bg-yellow-400 text-white font-bold py-2 px-8 rounded-full mb-6 relative shadow-md text-lg tracking-wider">
                        かんたん<span className="text-2xl mx-1">3</span>ステップ
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"></div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold font-maru text-brand-500 mb-4">
                        応募方法
                    </h2>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-600 font-maru">
                        ママ・パパのための<br className="md:hidden" />やさしいコンテスト
                    </h3>
                    <p className="mt-4 text-sm text-gray-500">
                        難しい操作はいりません。<br />
                        いつものスマホ操作だけで参加できます。
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative z-10">
                    {/* Arrow connectors could be added with pseudo elements or absolute SVGs */}

                    {/* Step 01 */}
                    <StepCard
                        num="01"
                        title="写真を選ぶ"
                        desc="スマホのアルバムから、お気に入りの1枚を選びます。"
                        icon={<ImageIcon className="w-12 h-12 text-brand-200" />}
                    />

                    {/* Step 02 */}
                    <StepCard
                        num="02"
                        title="アップロード"
                        desc="そのままアップロードするか、Instagramでタグ付け投稿でもOK。"
                        icon={<UploadCloud className="w-12 h-12 text-brand-200" />}
                    />

                    {/* Step 03 */}
                    <StepCard
                        num="03"
                        title="みんなで応援"
                        desc="素敵な作品にハートを送ろう。入賞作品はサイトで表彰！"
                        icon={<Heart className="w-12 h-12 text-brand-200" />}
                    />

                </div>

            </div>
        </section>
    )
}

function StepCard({ num, title, desc, icon }: { num: string, title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="bg-brand-50/50 p-8 rounded-3xl relative flex flex-col items-center">
            <div className="text-6xl font-black text-brand-200 mb-4 font-maru">{num}</div>
            <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center shadow-sm mb-6">
                {icon}
            </div>
            <h4 className="text-xl font-bold text-gray-700 mb-3 font-maru">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-bold">
                {desc}
            </p>
        </div>
    )
}
