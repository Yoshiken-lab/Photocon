'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

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
    return (
        <section id="faq" className="py-20 px-4 scroll-mt-24">
            <div className="max-w-3xl mx-auto bg-brand-50 p-8 md:p-12 rounded-[2.5rem]">
                <h3 className="text-center text-2xl md:text-3xl font-bold text-brand mb-10 font-maru tracking-wider">よくあるご質問</h3>

                <div className="space-y-4">
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
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand flex items-center justify-center shrink-0">
                        <span className="font-bold font-maru">Q</span>
                    </div>
                    <span className="font-bold text-gray-700 font-maru md:text-lg">{faq.question}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                    <div className="px-6 pb-6 pl-[4.5rem] text-gray-600 leading-relaxed text-sm md:text-base">
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    )
}
