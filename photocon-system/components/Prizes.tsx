'use client'

import React from 'react'

export const Prizes = () => {
    return (
        <section className="py-12 bg-brand-50">
            <div className="max-w-6xl mx-auto px-4">

                <div className="bg-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm">
                    {/* Header Tab */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white px-8 pt-2 rounded-b-2xl border-t-0 border border-gray-100 shadow-sm z-10">
                        <h2 className="text-2xl font-bold text-brand font-maru p-2">入選特典</h2>
                    </div>

                    {/* Decorations (Confetti) */}
                    <div className="absolute top-10 left-10 md:left-32 opacity-50">
                        <svg width="60" height="30" viewBox="0 0 100 50">
                            <path d="M0,25 C20,0 50,50 100,25" stroke="gray" fill="none" strokeWidth="2" />
                        </svg>
                    </div>
                    <div className="absolute top-10 right-10 md:right-32 opacity-50">
                        <svg width="60" height="30" viewBox="0 0 100 50">
                            <path d="M0,25 C20,0 50,50 100,25" stroke="gray" fill="none" strokeWidth="2" />
                        </svg>
                    </div>

                    <div className="mt-12 mb-8">
                        <div className="inline-block bg-yellow-400 text-white font-bold py-2 px-8 rounded-full mb-6 relative shadow-md">
                            入選者 ● 名様に
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"></div>
                        </div>

                        <h3 className="text-xl md:text-3xl font-bold text-gray-600 font-maru leading-loose">
                            「家族で使えるお食事券」など<br />
                            素敵なプレゼントをご用意しています。
                        </h3>
                    </div>

                    {/* Confetti squares */}
                    <div className="absolute bottom-10 left-20 w-8 h-8 bg-gray-300 rotate-12 opacity-50"></div>
                    <div className="absolute top-32 right-20 w-6 h-6 bg-gray-200 -rotate-12 opacity-50"></div>
                    <div className="absolute bottom-20 right-40 w-8 h-8 bg-gray-300 rotate-45 opacity-50"></div>

                </div>
            </div>
        </section>
    )
}
