'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'
import { submitInquiry } from '@/app/actions/inquiry'

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-[#E84D1C] text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-[#D63E0F] hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto w-full max-w-[280px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
                <>
                    <span>送信する</span>
                    <Send size={20} />
                </>
            )}
        </button>
    )
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function ContactPageO() {
    // INFO: useFormState signature: (action, initialState)
    const [state, dispatch] = useFormState(submitInquiry, { success: false, message: '' })
    const formRef = useRef<HTMLFormElement>(null)
    const [isSuccessAnim, setIsSuccessAnim] = useState(false)

    // 成功時の演出
    useEffect(() => {
        if (state.success) {
            setIsSuccessAnim(true)
            if (formRef.current) {
                formRef.current.reset()
            }
        }
    }, [state])

    return (
        <div className="min-h-screen bg-white font-sans pb-20">

            {/* Mobile Container (Max 600px) */}
            <div className="w-full md:max-w-[600px] mx-auto min-h-screen border-x border-brand-100/50 relative shadow-2xl pb-20 bg-[#FFF5F0] shadow-brand-100/20">

                {/* Header */}
                <header className="p-4 flex justify-between items-center bg-[#FFF5F0]/90 backdrop-blur sticky top-0 z-50">
                    <Link href="/sample-o" className="font-bold text-gray-400 hover:text-[#E84D1C] transition-colors flex items-center gap-1 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        TOP
                    </Link>
                    <div className="font-maru font-bold text-gray-700"></div>
                    <div className="w-12"></div>
                </header>

                <main className="px-4 py-8">

                    <div className="text-center mb-6">
                        <div className="inline-block bg-white p-3 rounded-full shadow-md mb-4 transform -rotate-6 border-2 border-brand-100">
                            <span className="text-3xl">✉️</span>
                        </div>
                        <h1 className="text-2xl font-bold font-maru text-[#E84D1C]">お問い合わせ</h1>
                        <p className="text-xs text-center text-gray-400 mt-2 font-maru">
                            ご返信には数日お時間をいただく場合がございます。
                        </p>
                    </div>

                    {/* Envelope Container */}
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden relative border-t-8 border-brand-200">
                        {/* Envelope Pattern Top */}
                        <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMEMxMCAxMCAxMCAxMCAyMCAwTDIwIDEwTDAgMTBaIiBmaWxsPSIjRkZFOEUwIi8+PC9zdmc+')] bg-repeat-x bg-[length:20px_10px] transform rotate-180 opacity-50"></div>

                        {/* Success Message Overlay */}
                        {isSuccessAnim && (
                            <div className="absolute inset-0 z-50 bg-[#FFF5F0]/90 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                                <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-4 border-brand-100">
                                    <CheckCircle size={64} className="text-[#E84D1C] mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800 font-maru mb-2">送信しました！</h2>
                                    <p className="text-gray-500 text-sm mb-6">
                                        お問い合わせありがとうございます。<br />
                                        確認次第、ご連絡させていただきます。
                                    </p>
                                    <button
                                        onClick={() => setIsSuccessAnim(false)}
                                        className="text-gray-400 font-bold text-sm hover:text-[#E84D1C] transition-colors"
                                    >
                                        閉じる
                                    </button>
                                </div>
                            </div>
                        )}

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

                                <form action={dispatch} ref={formRef} className="mt-4">

                                    {/* Inquiry Type (Dropdown) */}
                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-gray-400 mb-2 font-maru">件名を選んでください <span className="text-red-400">*</span></label>
                                        <div className="relative">
                                            <select
                                                name="category"
                                                defaultValue=""
                                                required
                                                className="w-full appearance-none bg-white/50 border-2 border-gray-300 rounded-lg p-3 text-sm font-bold text-gray-600 outline-none focus:border-[#E84D1C] focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="" disabled>選択してください...</option>
                                                <option value="contest">フォトコンテストについて</option>
                                                <option value="delete">投稿写真の削除</option>
                                                <option value="system">システムの不具合報告</option>
                                                <option value="other">その他・ご感想</option>
                                            </select>
                                            {/* Custom Arrow */}
                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-gray-400">
                                                ▼
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inputs */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">お名前 <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="山田 太郎"
                                            className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[#E84D1C] outline-none py-2 font-maru text-lg placeholder-gray-300 transition-colors"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">メールアドレス <span className="text-red-400">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="example@email.com"
                                            className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[#E84D1C] outline-none py-2 font-sans placeholder-gray-300 transition-colors"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-gray-400 mb-1">メッセージ本文 <span className="text-red-400">*</span></label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={5}
                                            placeholder="ここにメッセージを書いてください..."
                                            className="w-full bg-transparent border-none outline-none py-2 font-maru text-gray-700 resize-none placeholder-gray-300 leading-[30px]"
                                        ></textarea>
                                    </div>

                                    {/* Error Message Display */}
                                    {state.message && !state.success && (
                                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg border border-red-200">
                                            ⚠️ {state.message}
                                        </div>
                                    )}

                                    {/* Submit Area inside Form because of Server Actions but Styled outside visually if needed, 
                                        but SubmitButton needs to be inside form or use form prop. 
                                        Here we put it inside but we can style the container to look like footer */}

                                    {/* Spacer to push content up if needed */}
                                    <div className="h-4"></div>

                                    {/* Submit Area */}
                                    <div className="bg-gray-50 -mx-6 -mb-6 p-6 text-center border-t border-gray-100 rounded-b-sm">
                                        <SubmitButton />
                                        <p className="text-[10px] text-gray-400 mt-4">
                                            ご入力いただいた個人情報は、お問い合わせ対応のみに使用します。
                                        </p>
                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </main>
            </div>
        </div>
    )
}

