'use client'

import { Camera, Sparkles } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/autoplay'

// --- CMS Integration Ready: Data Structure ---
// In the future, this data can be fetched from an API or passed as props.
const HERO_SLIDES = [
    {
        id: 1,
        image: "bg-yellow-100", // Using color classes for placeholders, but this would be a URL
        text: "Kids Running",
        caption: "運動会のがんばった顔"
    },
    {
        id: 2,
        image: "bg-blue-100",
        text: "Eating Lunch",
        caption: "お弁当をほおばる笑顔"
    },
    {
        id: 3,
        image: "bg-pink-100",
        text: "Family Portrait",
        caption: "家族みんなの記念写真"
    },
    {
        id: 4,
        image: "bg-green-100",
        text: "Baby Smile",
        caption: "はじめての笑顔"
    }
]

// Placeholder for the "School Photo! Photo Contest" Logo/Badge
const ContestLogoBadge = () => (
    <div className="bg-white rounded-full p-4 md:p-8 shadow-2xl flex flex-col items-center justify-center aspect-square w-48 h-48 md:w-64 md:h-64 mx-auto relative z-20 border-4 border-brand-500 transform rotate-[-5deg] animate-float">
        <span className="bg-brand-500 text-white text-xs md:text-sm px-3 py-1 rounded-full font-bold mb-2">スマホで参加！体験型</span>
        <div className="text-center">
            {/* Simple Text Logo approximation */}
            <div className="text-brand-500 font-extrabold text-xl md:text-3xl leading-tight font-sans tracking-tighter">
                スクールフォト！
            </div>
            <div className="text-gray-800 font-black text-2xl md:text-4xl mt-1 font-maru">
                フォトコンテスト
            </div>
            <div className="text-gray-400 text-xs font-bold mt-2 tracking-widest">
                スマホに眠る宝物を送ろう
            </div>
        </div>
    </div>
)

export const HeroO = () => {
    return (
        <div className="w-full flex flex-col items-center pt-8 relative overflow-hidden">

            {/* --- Dynamic Slideshow Section --- */}
            <div className="relative w-full h-[450px] md:h-[600px] mb-8">

                {/* Swiper Container */}
                <div className="absolute inset-0 z-0">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        speed={1500}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        allowTouchMove={false} // Disable manual swiping for background effect feel
                        className="w-full h-full rounded-t-3xl md:rounded-3xl"
                    >
                        {HERO_SLIDES.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div className={`w-full h-full ${slide.image} flex items-center justify-center relative overflwo-hidden`}>
                                    {/* Placeholder Image Content */}
                                    <div className="text-4xl font-bold text-black/10 select-none">
                                        {slide.text}
                                    </div>

                                    {/* Caption Overlay (Optional) */}
                                    <div className="absolute bottom-10 left-0 w-full text-center opacity-0 animate-fade-in-up">
                                        <span className="bg-white/80 px-4 py-2 rounded-full text-brand-600 font-bold font-maru shadow-sm text-sm md:text-base backdrop-blur-sm">
                                            {slide.caption}
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Overlays & Floating Decorations */}

                {/* Central Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <ContestLogoBadge />
                </div>

                {/* Floating Elements (Animated) */}
                <div className="absolute top-10 left-10 text-yellow-400 animate-float-slow z-30 opacity-80">
                    <Sparkles size={48} fill="currentColor" />
                </div>
                <div className="absolute bottom-20 right-10 text-white animate-bounce-slow z-30 opacity-60">
                    <div className="bg-brand-400 p-3 rounded-full shadow-lg">
                        <Camera size={32} />
                    </div>
                </div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400/20 rounded-full blur-[40px] animate-pulse z-10"></div>
                <div className="absolute bottom-10 left-20 w-24 h-24 bg-red-400/20 rounded-full blur-[40px] animate-pulse delay-700 z-10"></div>

            </div>

            {/* CTA Section */}
            <div className="text-center pb-12 px-6 relative z-30">

                <div className="inline-block relative group">
                    <button className="bg-brand-500 text-white text-xl md:text-2xl font-bold py-5 px-16 rounded-full shadow-xl hover:bg-brand-600 hover:scale-105 transition-all transform flex items-center gap-3 mx-auto border-4 border-white/30 relative z-10 overflow-hidden">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shimmer" />

                        <Camera size={28} className="animate-pulse" />
                        <span>応募する</span>
                    </button>
                    {/* Button Glow */}
                    <div className="absolute top-2 left-0 w-full h-full bg-brand-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full z-0"></div>
                </div>

                <p className="mt-10 text-gray-600 font-medium leading-relaxed font-maru">
                    スマホの中に眠っている<br className="md:hidden" />お子さまのベストショット。<br />
                    <span className="bg-yellow-100 px-1">未来の宝物</span> として残しませんか？
                </p>

                {/* Scroll Indicator */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-60 animate-bounce">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-brand-400">SCROLL</span>
                    <div className="w-0.5 h-8 bg-brand-200"></div>
                </div>
            </div>

            {/* Dotted Divider */}
            <div className="w-full border-t-4 border-dotted border-gray-200" />

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-10px) rotate(-5deg); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                 @keyframes shimmer {
                    0% { left: -100%; }
                    50% { left: 100%; }
                    100% { left: 100%; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 2s infinite; }
            `}</style>
        </div>
    )
}
