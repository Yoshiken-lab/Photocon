'use client'

import { ArrowDown, Camera } from 'lucide-react'
import Image from 'next/image'

export function HeroF2() {
    return (
        <section className="relative bg-brand min-h-[calc(100vh-80px)] overflow-hidden flex flex-col items-center justify-center py-20">

            {/* Decorative Stars (Background) */}
            <div className="absolute top-10 right-10 text-white/20 transform rotate-12">
                <StarIcon size={120} />
            </div>
            <div className="absolute top-1/4 right-32 text-yellow-300/40 transform -rotate-12">
                <StarIcon size={40} filled />
            </div>
            <div className="absolute bottom-20 left-10 text-white/20 transform -rotate-12">
                <StarIcon size={80} />
            </div>
            <div className="absolute bottom-40 left-32 text-white/10 transform rotate-45">
                <StarIcon size={50} />
            </div>
            <div className="absolute top-20 left-1/4 text-white/10 transform rotate-45">
                <StarIcon size={30} />
            </div>
            <div className="absolute top-40 left-20 text-yellow-400/80 transform rotate-45 animate-pulse">
                <StarIcon size={40} />
            </div>
            <div className="absolute bottom-1/3 right-10 text-white/10 transform rotate-12">
                <StarIcon size={60} />
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 w-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Left Polaroid (Desktop) / Top (Mobile) */}
                <div className="relative transform -rotate-6 md:-rotate-12 transition-transform hover:rotate-0 duration-500 w-64 md:w-80 shrink-0">
                    <div className="bg-white p-4 pb-12 shadow-xl rotate-3">
                        <div className="bg-gray-200 w-full aspect-[3/4] overflow-hidden relative">
                            {/* Placeholder for joyful kid photo */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <Camera className="w-12 h-12 opacity-50" />
                            </div>
                        </div>
                    </div>
                    {/* Tape or detail could go here */}
                </div>

                {/* Center Text Area */}
                <div className="flex-1 text-center text-white relative">

                    {/* Floating Camera Illustration (Center Top) */}
                    <div className="mb-0 mx-auto w-32 h-32 md:w-40 md:h-40 bg-gray-800 rounded-3xl border-4 border-white transform -rotate-6 flex items-center justify-center shadow-lg relative z-20">
                        <div className="w-20 h-20 bg-gray-900 rounded-full border-4 border-gray-700 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-900 rounded-full bg-white/20"></div>
                        </div>
                        {/* Flash/Button details */}
                        <div className="absolute -top-2 right-4 w-6 h-4 bg-red-500 rounded-t-lg"></div>
                        {/* Shine marks */}
                        <div className="absolute -top-8 -right-8 text-yellow-400">
                            <SparkleIcon />
                        </div>
                    </div>

                    {/* Main Catchphrase Wrapper for Badge Positioning */}
                    <div className="relative inline-block mt-8">
                        <h1 className="text-4xl md:text-6xl font-bold font-maru leading-tight drop-shadow-md">
                            <span className="inline-block transform hover:scale-110 transition-transform">あ</span>
                            <span className="inline-block transform hover:scale-110 transition-transform">の</span>
                            <span className="inline-block transform hover:scale-110 transition-transform">日</span>
                            <span className="inline-block transform hover:scale-110 transition-transform">の</span>
                            <span className="inline-block border-2 border-white rounded px-2 mx-1 bg-white/10 rotate-3">一瞬</span>
                            を<br />
                            <span className="text-yellow-300">未</span>
                            <span className="text-yellow-300">来</span>
                            <span className="text-yellow-300">の</span>
                            <span className="inline-block transform -rotate-2 origin-bottom-left text-5xl md:text-7xl">宝物</span>
                            に
                        </h1>

                        {/* Campaign Badge (Speech Bubble Style) */}
                        <div className="absolute -top-24 -right-8 md:-top-32 md:-right-24 z-20 transform rotate-6 bg-yellow-400 text-brand-500 p-4 md:p-6 rounded-full shadow-xl flex flex-col items-center justify-center border-4 border-white w-32 h-32 md:w-44 md:h-44 animate-bounce-slow">
                            <span className="text-xs md:text-sm font-bold tracking-widest bg-white/50 px-2 py-0.5 rounded mb-1 relative z-10">THEME</span>
                            <span className="text-2xl md:text-4xl font-bold font-maru leading-none mb-1 relative z-10">「桜」</span>
                            <span className="text-[10px] md:text-xs font-bold border-t-2 border-brand-500/30 pt-1 mt-1 relative z-10">2026/4/24(金)まで</span>

                            {/* Speech Bubble Tail */}
                            <div className="absolute bottom-4 -left-2 w-8 h-8 bg-yellow-400 rotate-45 border-l-4 border-b-4 border-white"></div>
                        </div>
                    </div>

                    <p className="mt-8 font-bold text-lg md:text-xl tracking-wide opacity-90">
                        運動会のがんばった顔、お弁当をほおばる笑顔。<br />
                        スマホの中に眠っているお子さまのベストショットを<br />
                        みんなでシェアして楽しみませんか？
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
                        <button className="bg-brand-500 text-white border-4 border-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-brand-600 hover:scale-105 transition-all transform hover:-rotate-1">
                            写真を応募する
                        </button>
                        <button className="bg-white text-brand px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-all transform hover:rotate-1">
                            作品を見る
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-white/80 font-bold">
                        ※登録は無料です。1分で完了します。
                    </p>

                </div>

                {/* Right Polaroid */}
                <div className="relative transform rotate-6 md:rotate-12 transition-transform hover:rotate-0 duration-500 w-64 md:w-80 shrink-0 hidden md:block">
                    <div className="bg-white p-4 pb-12 shadow-xl -rotate-2">
                        <div className="bg-gray-200 w-full aspect-[3/4] overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <Camera className="w-12 h-12 opacity-50" />
                            </div>
                        </div>
                    </div>
                    {/* Sticker decoration */}
                    <div className="absolute -top-4 -right-4 text-yellow-400 transform rotate-12">
                        <StarIcon size={64} filled />
                    </div>
                </div>

            </div>



            {/* Scroll Down Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center gap-2 animate-bounce opacity-80">
                <div className="bg-white/20 p-2 rounded-full">
                    <ArrowDown className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">Scroll Down</span>
            </div>

            {/* Bottom Curve Divider */}
            <div className="absolute -bottom-1 left-0 w-full leading-none text-white">
                <svg viewBox="0 0 1440 100" className="w-full h-12 md:h-24 fill-current" preserveAspectRatio="none">
                    <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="white"></path>
                </svg>
            </div>

        </section>
    )
}

function StarIcon({ size = 24, filled = false }: { size?: number, filled?: boolean }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "currentColor"}
            stroke="none"
            className=""
        >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    )
}

function SparkleIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
    )
}
