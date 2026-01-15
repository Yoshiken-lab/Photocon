'use client'

import React from 'react'

export const HowToApply = () => {
    return (
        <section className="py-20 bg-brand-50">
            <div className="max-w-6xl mx-auto px-4 text-center">

                <div className="bg-white rounded-[3rem] py-12 px-6 shadow-sm">

                    {/* Header */}
                    <div className="mb-10 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 bg-white w-40 h-8 rounded-t-xl"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand font-maru relative z-10">応募方法</h2>
                    </div>

                    <div className="inline-block bg-yellow-400 text-white font-bold py-2 px-8 rounded-full mb-6 relative">
                        かんたん <span className="text-2xl">3</span> ステップ
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"></div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-700 font-maru mb-4">
                        ママ・パパのための <br /> やさしいコンテスト
                    </h3>

                    <p className="text-gray-500 text-sm mb-12">
                        難しい操作はいりません。<br />
                        いつものスマホ操作だけで参加できます。
                    </p>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-5xl mx-auto relative">

                        {/* Arrow connectors for desktop */}
                        <div className="hidden md:block absolute top-1/2 left-1/3 transform -translate-y-1/2 text-gray-200">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <div className="hidden md:block absolute top-1/2 right-1/3 transform -translate-y-1/2 text-gray-200">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>

                        {/* Step 1 */}
                        <div className="bg-brand-50 rounded-2xl p-8 relative">
                            <div className="text-brand text-4xl font-bold font-maru mb-4">01</div>
                            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 shadow-sm"></div>
                            <h4 className="font-bold text-lg mb-2">写真を選ぶ</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                スマホのアルバムから、<br />
                                お気に入りの1枚を選びます。
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-brand-50 rounded-2xl p-8 relative">
                            <div className="text-brand text-4xl font-bold font-maru mb-4">02</div>
                            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 shadow-sm"></div>
                            <h4 className="font-bold text-lg mb-2">アップロード</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                そのままアップロードするか、<br />
                                Instagramでタグ付け投稿でもOK。
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-brand-50 rounded-2xl p-8 relative">
                            <div className="text-brand text-4xl font-bold font-maru mb-4">03</div>
                            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-6 shadow-sm"></div>
                            <h4 className="font-bold text-lg mb-2">みんなで応援</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                素敵な作品にハートを送ろう。<br />
                                入賞作品はサイトで表彰！
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
