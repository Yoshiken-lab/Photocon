'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
    {
        question: '無料で応募できますか？',
        answer: 'スマートフォンやパソコンがあれば無料で応募できます。テーマに沿ったお写真をご用意の上、ぜひご参加ください。'
    },
    {
        question: '子ども以外の写真（風景や動物など）も応募できますか？',
        answer: 'お子様が写っているお写真でご応募ください。'
    },
    {
        question: '一人何枚まで応募できますか？',
        answer: '何枚でも応募できます。'
    },
    {
        question: '写真の形式やサイズに制限はありますか？',
        answer: 'JPEG・JPG・PNGのみ対応しております。また、サイズに関しては15MBまで受け付けております。'
    },
    {
        question: '応募した写真を後から削除できますか？',
        answer: 'お写真の削除依頼に関しましては、「お問い合わせ」からお問い合わせください。'
    }
]

export const SampleFAQ = () => {
    // 独立して開閉できるようにstate管理を個別に持つか、単にmap内でstateを持つコンポーネントに分ける
    // ここではシンプルに各アイテムの状態を配列で持たず、個別のFAQアイテムコンポーネントを作成して状態を閉じ込めるアプローチにします。

    return (
        <section id="faq" className="py-20 px-4 scroll-mt-24">
            <div className="max-w-4xl mx-auto bg-brand-50 p-8 md:p-12 rounded-[2.5rem]">
                <h3 className="text-center text-2xl md:text-3xl font-bold text-brand mb-10 font-maru tracking-wider">よくあるご質問</h3>

                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const FAQItem = ({ faq }: { faq: { question: string, answer: string } }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-transparent hover:border-brand-100 overflow-hidden flex flex-col h-full duration-300 ${isOpen ? 'ring-2 ring-brand-100' : ''}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-start justify-between text-left gap-3 flex-1 group"
            >
                <span className={`font-bold font-maru text-base md:text-lg transition-colors leading-relaxed ${isOpen ? 'text-brand' : 'text-gray-700'}`}>
                    {faq.question}
                </span>
                <span className={`shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'text-brand' : 'text-gray-400 group-hover:text-brand-300'}`}>
                    {isOpen ? (
                        <ChevronUp className="w-6 h-6" />
                    ) : (
                        <ChevronDown className="w-6 h-6" />
                    )}
                </span>
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="bg-brand-50/50 px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-dashed border-brand-100 mx-4">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    )
}
