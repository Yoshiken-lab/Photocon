'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'

export const Hero = () => {
    return (
        <section className="bg-brand-50 pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto bg-gray-200 rounded-[3rem] overflow-hidden shadow-lg relative h-[500px] md:h-[600px]">

                {/* Decorative Camera/Illustration Placeholder */}
                <div className="absolute bottom-20 left-10 md:left-20 transform -rotate-12 z-20">
                    {/* Simple CSS/SVG Camera representation based on Image 0 */}
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

                {/* Vertical Text */}
                <div className="absolute top-10 left-10 md:top-20 md:left-20 z-10 flex gap-6 md:gap-8 writing-mode-vertical text-black">
                    <h1 className="text-4xl md:text-6xl font-bold font-maru tracking-widest leading-loose drop-shadow-sm flex flex-row-reverse gap-4 md:gap-8 items-start h-full">
                        <span className="block py-2 bg-white/80 rounded shadow-sm">あの日の一瞬を</span>
                        <span className="block py-2 bg-white/80 rounded shadow-sm mt-16 md:mt-24">未来の宝物に</span>
                    </h1>
                </div>

                {/* Background Overlay / Image Placeholder */}
                {/* Ideally this would be the photo of the child on the grass */}
                <div className="absolute inset-0 bg-gray-300 opacity-50"></div>

                {/* CTA Button Area - Bottom Right */}
                <div className="absolute bottom-8 right-4 md:bottom-12 md:right-12 w-full max-w-sm md:max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-xl">
                    <p className="text-gray-700 text-sm md:text-base mb-4 font-medium leading-relaxed">
                        運動会のがんばった顔、お弁当をほおばる笑顔。<br />
                        スマホの中に眠っているお子さまのベストショットを<br />
                        みんなでシェアして楽しみませんか？
                    </p>
                    <button className="w-full bg-brand hover:bg-brand-600 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                        <span>写真を応募する</span>
                        <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </button>
                    <p className="text-xs text-right text-gray-400 mt-2">※登録は無料です。1分で完了します。</p>
                </div>
            </div>
        </section>
    )
}
