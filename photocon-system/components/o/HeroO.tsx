'use client'

import { Camera, Sparkles } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/autoplay'

// --- Props Definition ---
interface HeroSlide {
    id: string
    imageUrl: string
    title: string
    caption: string
}

// Placeholder for the "School Photo! Photo Contest" Logo/Badge
const ContestLogoBadge = () => (
    <div className="bg-white rounded-full p-0 shadow-2xl flex flex-col items-center justify-center aspect-square w-48 h-48 md:w-64 md:h-64 mx-auto relative z-20 border-4 border-brand-500 transform rotate-[-5deg] animate-float">
        <div className="w-full h-full overflow-hidden rounded-full">
            <img src="/top_logo.png" alt="スクールフォト！フォトコンテスト" className="w-full h-full object-cover transform scale-110 drop-shadow-sm" />
        </div>
    </div>
)

export const HeroO = ({ slides }: { slides: HeroSlide[] }) => {
    // Fallback if empty (though logic handles it)
    const effectiveSlides = slides.length > 0 ? slides : []

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
                        {effectiveSlides.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <div className="w-full h-full relative overflow-hidden">
                                    {/* Image */}
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.title}
                                        className="w-full h-full object-cover animate-zoom-slow" // Add slow zoom effect if possible, or just cover
                                    />

                                    {/* Caption Overlay */}
                                    <div className="absolute bottom-28 left-0 w-full text-center opacity-0 animate-fade-in-up">
                                        <span className="bg-white/90 px-6 py-2 rounded-full text-brand-600 font-bold font-maru shadow-lg text-sm md:text-base backdrop-blur-md">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none translate-y-12">
                    <ContestLogoBadge />

                    {/* Scroll Indicator - Relocated */}
                    <div className="mt-12 flex flex-col items-center gap-2 opacity-80 animate-bounce">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-white shadow-black drop-shadow-md">SCROLL</span>
                        <div className="w-0.5 h-12 bg-white shadow-black drop-shadow-md"></div>
                    </div>
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

                <p className="text-gray-600 font-medium leading-relaxed font-maru mb-10">
                    スマホの中に眠っている<br className="md:hidden" />お子さまのベストショット。<br />
                    <span className="bg-yellow-100 px-1">未来の宝物</span> として残しませんか？
                </p>

                <div className="inline-block relative group">
                    <Link href="/sample-o/apply" className="bg-[#E84D1C] text-white text-xl md:text-2xl font-bold py-5 px-16 rounded-full shadow-xl hover:bg-[#D63E0F] hover:scale-105 transition-all transform flex items-center gap-3 mx-auto border-4 border-white/30 relative z-10 overflow-hidden block w-fit">
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-shimmer" />

                        <Camera size={28} className="animate-pulse" />
                        <span>応募する</span>
                    </Link>
                    {/* Button Glow */}
                    <div className="absolute top-2 left-0 w-full h-full bg-brand-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity rounded-full z-0"></div>
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
                .animate-zoom-slow { animation: zoom-slow 20s linear infinite; }
                @keyframes zoom-slow {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
            `}</style>
        </div>
    )
}
