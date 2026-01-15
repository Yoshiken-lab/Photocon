'use client'

import React from 'react'

const faqs = [
    {
        question: '無料で応募できますか？',
        answer: 'スマートフォンやパソコンがあれば無料で応募できます。テーマに沿ったお写真をご用意の上、ぜひご参加ください。',
        colorTheme: {
            bg: 'border-brand-200',
            hover: 'hover:border-brand-400',
            qBg: 'bg-brand-100',
            qText: 'text-brand-600'
        }
    },
    {
        question: '写真の形式やサイズに制限はありますか？',
        answer: 'JPEG・JPG・PNGのみ対応しております。また、サイズに関しては15MBまで受け付けております。',
        colorTheme: {
            bg: 'border-yellow-200',
            hover: 'hover:border-yellow-400',
            qBg: 'bg-yellow-100',
            qText: 'text-yellow-600'
        }
    },
    {
        question: '子ども以外の写真（風景や動物など）も応募できますか？',
        answer: 'お子様が写っているお写真でご応募ください。',
        colorTheme: {
            bg: 'border-blue-200',
            hover: 'hover:border-blue-400',
            qBg: 'bg-blue-100',
            qText: 'text-blue-600'
        }
    },
    {
        question: '一人何枚まで応募できますか？',
        answer: '何枚でも応募できます。',
        colorTheme: {
            bg: 'border-green-200',
            hover: 'hover:border-green-400',
            qBg: 'bg-green-100',
            qText: 'text-green-600'
        }
    },
    {
        question: '応募した写真を後から削除できますか？',
        answer: 'お写真の削除依頼に関しましては、「お問い合わせ」からお問い合わせください。',
        colorTheme: {
            bg: 'border-purple-200',
            hover: 'hover:border-purple-400',
            qBg: 'bg-purple-100',
            qText: 'text-purple-600'
        }
    }
]

export function FAQF2() {
    return (
        <section className="bg-yellow-50 py-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h3 className="text-4xl md:text-5xl font-black text-gray-800 tracking-wider mb-2 font-maru opacity-10">Q&A</h3>
                    <p className="text-[#E75D2E] font-bold text-2xl md:text-3xl font-maru -mt-8 relative z-10">よくあるご質問</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white p-6 md:p-8 rounded-[2rem] border-b-8 border-r-8 ${faq.colorTheme.bg} ${faq.colorTheme.hover} transition-all duration-300 shadow-sm hover:-translate-y-1`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${faq.colorTheme.qBg} ${faq.colorTheme.qText} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black flex-shrink-0 text-lg`}>
                                    Q
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-lg md:text-xl mb-3 font-maru">
                                        {faq.question}
                                    </h4>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed border-t-2 border-dashed border-gray-100 pt-3">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
