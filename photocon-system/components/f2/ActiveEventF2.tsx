'use client'

import { Star, Clock, Image as ImageIcon } from 'lucide-react'

export function ActiveEventF2() {
    return (
        <section className="bg-white py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">

                {/* Section Title */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-6 h-6 rounded-full bg-[#E75D2E]"></div>
                    <h2 className="text-3xl md:text-4xl font-bold font-maru text-[#E75D2E]">
                        開催中のイベント
                    </h2>
                </div>

                {/* Main Event Card */}
                <div className="relative">
                    <div className="border-4 border-brand-200 rounded-[3rem] p-8 md:p-12 relative bg-white z-10 flex flex-col md:flex-row gap-8 items-stretch">

                        {/* Text Content */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-700 border-b-2 border-gray-200 pb-4 inline-block pr-12 font-maru">
                                    2026年春のフォトコンテスト
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">テーマ</span>
                                    <span className="text-2xl font-bold font-maru text-gray-800">「桜」</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm md:text-base">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">開催日時</span>
                                    <span className="font-bold font-sans text-gray-700">2026年4月10日(金) 〜 2026年4月24日(金)</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm md:text-base">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">応募件数</span>
                                    <span className="font-bold font-sans text-gray-700 font-maru">2件</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm md:text-base">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">残り</span>
                                    <span className="font-bold font-sans text-gray-700 font-maru">残り0日</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Placeholder */}
                        <div className="w-full md:w-80 shrink-0 bg-gray-200 rounded-3xl min-h-[200px] md:min-h-auto"></div>

                    </div>

                    {/* Apply Now Badge (Sticker) */}
                    <div className="absolute -bottom-6 -right-2 md:bottom-8 md:-right-12 z-20 transform rotate-12 transition-transform hover:scale-110 hover:rotate-6 cursor-pointer group">
                        <div className="bg-[#E75D2E] text-white p-6 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] shadow-lg flex flex-col items-center justify-center border-4 border-[#E75D2E] text-center relative rotate-3">
                            <span className="text-xl md:text-2xl font-bold font-maru leading-tight drop-shadow-sm">
                                今すぐ<br />応募する
                            </span>
                            {/* Star Decoration */}
                            <Star className="text-yellow-300 w-8 h-8 absolute -top-4 -right-4 fill-current rotate-12" />
                            <Star className="text-[#FFF4F0] w-6 h-6 absolute bottom-2 -left-4 fill-current -rotate-12" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
