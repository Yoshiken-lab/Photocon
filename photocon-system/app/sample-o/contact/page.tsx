'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ContactPageO() {
    return (
        <div className="min-h-screen bg-[#FFF5F0] font-sans pb-20">

            {/* Mobile Container (Max 600px) */}
            <div className="w-full md:max-w-[600px] mx-auto min-h-screen border-x border-brand-100/50 relative shadow-2xl pb-20 bg-[#FFF5F0]">

                {/* Header */}
                <header className="p-4 flex justify-between items-center bg-[#FFF5F0]/90 backdrop-blur sticky top-0 z-50">
                    <Link href="/sample-o" className="font-bold text-gray-400 hover:text-[#E84D1C] transition-colors flex items-center gap-1 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        TOP
                    </Link>
                    <div className="font-maru font-bold text-gray-700">お手紙（お問い合わせ）</div>
                    <div className="w-12"></div>
                </header>

                <main className="px-4 py-8">

                    <div className="text-center mb-6">
                        <div className="inline-block bg-white p-3 rounded-full shadow-md mb-4 transform -rotate-6 border-2 border-brand-100">
                            <span className="text-3xl">✉️</span>
                        </div>
                        <h1 className="text-2xl font-bold font-maru text-[#E84D1C]">お問い合わせ</h1>
                        <p className="text-xs text-gray-500 mt-2">どのようなご用件でしょうか？</p>
                    </div>

                    {/* Envelope Container */}
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden relative border-t-8 border-brand-200">
                        {/* Envelope Pattern Top */}
                        <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMEMxMCAxMCAxMCAxMCAyMCAwTDIwIDEwTDAgMTBaIiBmaWxsPSIjRkZFOEUwIi8+PC9zdmc+')] bg-repeat-x bg-[length:20px_10px] transform rotate-180 opacity-50"></div>

                        <div className="p-6 pt-10">

                            {/* Paper Content */}
                            <div
                                className="bg-[#FDFBF7] p-6 rounded-sm shadow-inner md:min-h-[500px] relative"
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(#F0F0F0 0px, #F0F0F0 1px, transparent 1px, transparent 30px)',
                                    backgroundSize: '100% 30px'
                                }}
                            >

                                {/* Tape Effect */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/60 rotate-[-1deg] shadow-sm transform backdrop-blur-sm z-10"></div>

                                <form className="mt-4">

                                    {/* Inquiry Type (Dropdown) */}
                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-gray-400 mb-2 font-maru">件名を選んでください</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none bg-white/50 border-2 border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-600 outline-none focus:border-[#E84D1C] focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="" disabled selected>選択してください...</option>
                                                <option value="contest">📷 フォトコンテストについて</option>
                                                <option value="system">🔧 システムの不具合報告</option>
                                                <option value="other">📝 その他・ご感想</option>
                                            </select>
                                            {/* Custom Arrow */}
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400">
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inputs */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">お名前</label>
                                        <input
                                            type="text"
                                            placeholder="山田 太郎"
                                            className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[#E84D1C] outline-none py-2 font-maru text-lg placeholder-gray-300 transition-colors"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">メールアドレス</label>
                                        <input
                                            type="email"
                                            placeholder="example@email.com"
                                            className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[#E84D1C] outline-none py-2 font-sans placeholder-gray-300 transition-colors"
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">メッセージ本文</label>
                                        <textarea
                                            rows={5}
                                            placeholder="ここにメッセージを書いてください..."
                                            className="w-full bg-transparent border-none outline-none py-2 font-maru text-gray-700 resize-none placeholder-gray-300 leading-[30px]"
                                        ></textarea>
                                    </div>

                                </form>

                            </div>

                        </div>

                        {/* Submit Area */}
                        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                            <button className="bg-[#E84D1C] text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-[#D63E0F] hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto w-full max-w-[280px]">
                                <span>ポストに入れる</span>
                                <span className="text-xl">📮</span>
                            </button>
                            <p className="text-[10px] text-gray-400 mt-4">
                                ご入力いただいた個人情報は、お問い合わせ対応のみに使用します。
                            </p>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}
