import Image from 'next/image'
import Link from 'next/link'

export function GalleryO() {
    return (
        <section className="py-20 px-4 bg-orange-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                        </span>
                        <span className="text-brand font-bold text-sm">みんなの応募作品</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">こんな写真が届いています！</h2>
                    <p className="text-gray-500 text-sm">スマホで撮ったお子さまの日常の1枚でOK</p>
                </div>

                {/* Horizontal Scroll Gallery */}
                <div className="relative mb-8">
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">

                        <GalleryItem id="g1" user="@happy_mama" likes="312" isPopular />
                        <GalleryItem id="g2" user="@smile_kids" likes="245" isNew />
                        <GalleryItem id="g3" user="@papa_camera" likes="198" />
                        <GalleryItem id="g4" user="@family_life" likes="167" />
                        <GalleryItem id="g5" user="@sunny_day" likes="143" />

                        {/* More Card */}
                        <div className="flex-shrink-0 w-64 snap-start">
                            <Link href="#" className="block bg-white rounded-2xl overflow-hidden shadow-lg h-full hover:shadow-xl transition-shadow group">
                                <div className="aspect-[4/5] bg-orange-50 flex flex-col items-center justify-center text-brand h-full">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                    <span className="font-bold text-lg">もっと見る</span>
                                    <span className="text-sm text-gray-500 mt-1">+120作品</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Swipe Hint (Mobile) */}
                    <div className="flex justify-center md:hidden mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            スワイプして見る
                        </span>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold transition-all shadow-lg shadow-brand/30 hover:-translate-y-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        私も応募する
                    </Link>
                    <p className="text-xs text-gray-400 mt-4">※ 掲載している写真はイメージです</p>
                </div>
            </div>
        </section>
    )
}

function GalleryItem({ id, user, likes, isPopular, isNew }: { id: string, user: string, likes: string, isPopular?: boolean, isNew?: boolean }) {
    return (
        <div className="flex-shrink-0 w-64 snap-start">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="aspect-[4/5] relative">
                    <Image src={`https://picsum.photos/400/500?random=${id}`} alt="" fill className="object-cover" />

                    {isPopular && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded-full">人気</span>
                        </div>
                    )}
                    {isNew && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">NEW</span>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center justify-between text-white">
                            <span className="text-sm font-bold">{user}</span>
                            <span className="flex items-center gap-1 text-sm">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                {likes}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
