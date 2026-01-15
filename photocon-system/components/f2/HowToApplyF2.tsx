'use client'

import { Image as ImageIcon, UploadCloud, Heart, Play } from 'lucide-react'

export function HowToApplyF2() {
    return (
        <section className="bg-[#FFF5F0] py-20 px-4">
            <div className="max-w-6xl mx-auto relative pt-8">

                {/* Title Tab */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white px-16 py-5 rounded-t-[2rem] shadow-sm z-10 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold font-maru text-[#E75D2E]">
                        応募方法
                    </h2>
                </div>

                {/* Main White Card */}
                <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-sm relative z-0 pt-24 text-center">

                    {/* Header Area */}
                    <div className="mb-16 relative">
                        {/* "Easy 3 Steps" Badge */}
                        <div className="inline-block bg-[#F4B207] text-white font-bold py-2 px-10 rounded-full mb-8 relative shadow-md text-lg tracking-wider">
                            かんたん<span className="text-2xl mx-1 font-maru">3</span>ステップ
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#F4B207] rotate-45"></div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-bold text-gray-600 font-maru mb-6">
                            ママ・パパのための<br />
                            やさしいコンテスト
                        </h3>
                        <p className="mt-4 text-sm md:text-base text-gray-500 font-medium">
                            難しい操作はいりません。<br />
                            いつものスマホ操作だけで参加できます。
                        </p>
                    </div>

                    {/* Steps Flow */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">

                        {/* Step 01 */}
                        <StepCard
                            num="01"
                            title="写真を選ぶ"
                            desc="スマホのアルバムから、<br/>お気に入りの1枚を選びます。"
                        />

                        {/* Arrow 1 */}
                        <div className="hidden md:block text-gray-200">
                            <Play className="w-8 h-8 fill-current" />
                        </div>

                        {/* Step 02 */}
                        <StepCard
                            num="02"
                            title="アップロード"
                            desc="そのままアップロードするか、<br/>Instagramでタグ付け投稿でもOK。"
                        />

                        {/* Arrow 2 */}
                        <div className="hidden md:block text-gray-200">
                            <Play className="w-8 h-8 fill-current" />
                        </div>

                        {/* Step 03 */}
                        <StepCard
                            num="03"
                            title="みんなで応援"
                            desc="素敵な作品にハートを送ろう。<br/>入賞作品はサイトで表彰！"
                        />
                    </div>

                </div>
            </div>
        </section>
    )
}

function StepCard({ num, title, desc }: { num: string, title: string, desc: string }) {
    return (
        <div className="bg-[#FFF5F0] p-8 rounded-[2rem] w-full md:w-1/3 min-h-[320px] flex flex-col items-center justify-center relative group hover:bg-brand-50 transition-colors mt-8 md:mt-0">
            <div className="absolute -top-6 left-6 text-5xl md:text-6xl font-black text-[#E75D2E]/80 font-maru">{num}</div>

            {/* Circle Mockup */}
            <div className="bg-white w-24 h-24 rounded-full mb-6 shadow-none"></div>

            <h4 className="text-xl font-bold text-gray-700 mb-4 font-maru">{title}</h4>
            <p
                className="text-xs md:text-sm text-gray-500 leading-relaxed font-bold"
                dangerouslySetInnerHTML={{ __html: desc }}
            />
        </div>
    )
}
