'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'

export const Hero = () => {
    return (
        <section className="bg-brand-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Vertical Text (Visualized as separate or overlapping the image in the original design, but here adhering to "vertical text" request) */}
                {/* Wait, looking at the image 0, the vertical text is INSIDE the gray box. 
                    The CTA is OUTSIDE/Below. 
                    Let's adjust: Gray box covers the image and vertical text area. 
                    CTA is below it.
                */}
            </div>

            <div className="max-w-6xl mx-auto relative">
                <div className="bg-gray-200 rounded-[3rem] overflow-hidden shadow-lg relative h-[500px] md:h-[600px] w-full">
                    {/* Decorative Camera */}
                    <div className="absolute bottom-6 left-10 md:left-20 transform -rotate-12 z-20">
                        <div className="relative w-32 h-24 bg-gray-700 rounded-xl flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-600"></div>
                            <div className="absolute -top-3 right-4 w-8 h-3 bg-gray-700 rounded-t"></div>
                            <div className="absolute -top-6 right-8 text-yellow-400">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L15 8L22 9L17 14L18 21L12 17L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Text - Using writing-mode: vertical-rl */}
                    <div className="absolute top-12 left-10 md:left-24 z-10 select-none pointer-events-none h-[400px]" style={{ writingMode: 'vertical-rl' }}>
                        {/* First Line */}
                        <div className="relative mx-2">
                            <div className="absolute inset-y-2 inset-x-[-1.5rem] bg-white/90 rounded-lg shadow-md"></div>
                            <h1 className="relative text-4xl md:text-5xl font-bold font-maru tracking-widest leading-relaxed drop-shadow-sm text-gray-800 py-4 px-6 whitespace-nowrap">
                                あの日の一瞬を
                            </h1>
                        </div>
                        {/* Second Line */}
                        <div className="relative mx-2 mt-8 md:mt-12">
                            <div className="absolute inset-y-2 inset-x-[-1.5rem] bg-white/90 rounded-lg shadow-md"></div>
                            <h1 className="relative text-4xl md:text-5xl font-bold font-maru tracking-widest leading-relaxed drop-shadow-sm text-gray-800 py-4 px-6 whitespace-nowrap">
                                未来の宝物に
                            </h1>
                        </div>
                    </div>
                </div>

                {/* CTA Section - Option 3: Glass Float Compact */}
                <div className="relative z-20 mt-4 ml-auto mr-4 md:mr-12 max-w-3xl">
                    <div className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 space-y-1 text-center md:text-left">
                            <p className="font-bold text-gray-700 text-sm md:text-base leading-relaxed">
                                運動会のがんばった顔、お弁当をほおばる笑顔。<br className="hidden md:block" />
                                スマホの中に眠っているお子さまのベストショットを<br className="hidden md:block" />
                                みんなでシェアして楽しみませんか？
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500">※登録は無料です。1分で完了します。</p>
                        </div>
                        <div className="w-full md:w-auto shrink-0">
                            <button className="w-full md:w-auto bg-brand text-white px-6 py-2.5 rounded-lg font-bold text-sm md:text-base shadow-sm hover:bg-brand-600 transition-colors flex items-center justify-center gap-2">
                                写真を応募する
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add some bottom margin to account for the overlapping CTA */}
                <div className="h-20"></div>

            </div>
        </section>
    )
}
