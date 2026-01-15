'use client'

import React from 'react'

export const ActiveEvent = () => {
    return (
        <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto bg-brand rounded-3xl p-1 md:p-2 shadow-xl">
                {/* Header */}
                <div className="text-center py-4">
                    <h2 className="text-white text-2xl md:text-3xl font-bold font-maru tracking-widest relative inline-block">
                        募集中のイベント
                        {/* Simple decoration line if needed, but text is white on brand bg */}
                    </h2>
                </div>

                {/* Card Content */}
                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-inner">
                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* Text Info */}
                        <div className="flex-1 space-y-4 w-full">
                            <h3 className="text-xl md:text-2xl font-bold text-brand border-b border-gray-300 pb-2">
                                2026年春のフォトコンテスト
                            </h3>

                            <div className="space-y-4 text-gray-700">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">テーマ</span>
                                    <span className="text-lg font-bold">「桜」</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">開催日時</span>
                                    <span className="text-sm font-medium">2026年4月10日(金)〜2026年4月24日(金)</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">応募件数</span>
                                    <span className="text-sm">2件</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-gray-500 w-24 shrink-0">残り</span>
                                    <span className="text-sm text-brand font-bold">残り0日</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="flex-1 bg-brand hover:bg-brand-600 text-white font-bold py-4 rounded-full shadow-md transition-colors flex items-center justify-center gap-2">
                                    <span>写真を応募する</span>
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">▶</div>
                                </button>
                                <button className="flex-1 bg-white border-2 border-brand text-gray-600 hover:bg-gray-50 font-bold py-4 rounded-full shadow-sm transition-colors flex items-center justify-center gap-2">
                                    <span>作品を見る</span>
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-brand">▶</div>
                                </button>
                            </div>
                        </div>

                        {/* Image Placeholder */}
                        <div className="w-full md:w-1/3 aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                            {/* Placeholder for the event image */}
                            <div className="w-full h-full bg-gray-300 rounded-xl"></div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
