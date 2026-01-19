'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Smile } from 'lucide-react'

const faqs = [
    {
        q: "無料で応募できますか？",
        a: "スマートフォンやパソコンがあれば無料で応募できます。テーマに沿ったお写真をご用意の上、ぜひご参加ください。"
    },
    {
        q: "子ども以外の写真（風景や動物など）も応募できますか？",
        a: "お子様が写っているお写真でご応募ください。"
    },
    {
        q: "一人何枚まで応募できますか？",
        a: "何枚でも応募できます。"
    },
    {
        q: "写真の形式や写真のサイズに制限はありますか？",
        a: "JPEG・JPG・PNGのみ対応しております。また、サイズに関しては15MBまで受け付けております。"
    },
    {
        q: "応募した写真を後から削除できますか？",
        a: "お写真の削除依頼に関しましては、「お問い合わせ」からお問い合わせください。"
    }
]

export const FAQO = () => {
    return (
        <div id="faq" className="w-full bg-white py-24 px-6 relative overflow-hidden">
            {/* Diagonal Header Decoration */}
            <div className="absolute top-0 left-0 w-full h-[80px] bg-[#FFF5F0] skew-y-2 origin-top-right transform -translate-y-10 z-0"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16 relative z-10"
            >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-100 text-brand-600 mb-4">
                    <MessageCircle size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 font-maru mb-2">よくあるご質問</h2>
                <div className="h-1 w-16 bg-brand-500 mx-auto rounded-full"></div>
            </motion.div>

            <div className="max-w-md mx-auto relative z-10 space-y-10">
                {faqs.map((faq, index) => (
                    <div key={index} className="space-y-6">
                        {/* Question (User) - Left Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-end"
                        >
                            <div className="bg-brand-100 text-gray-800 text-sm font-bold py-4 px-5 rounded-2xl rounded-bl-sm shadow-sm max-w-[85%] relative mt-2">
                                <span className="absolute -top-3 -left-2 bg-white text-[#E84D1C] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ffe8e0] shadow-sm z-10">
                                    Question
                                </span>
                                {faq.q}
                                {/* Tail */}
                                <div className="absolute bottom-[0px] left-[-8px] w-0 h-0 border-t-[0px] border-t-transparent border-r-[8px] border-r-brand-100 border-b-[8px] border-b-transparent"></div>
                            </div>
                        </motion.div>

                        {/* Answer (Admin) - Right Side */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.05 }}
                            viewport={{ once: true }}
                            className="flex justify-end items-end"
                        >
                            <div className="bg-white border-2 border-brand-50 text-gray-700 text-sm font-bold py-4 px-5 rounded-2xl rounded-br-sm shadow-sm max-w-[85%] relative text-left">
                                <span className="absolute -top-3 -right-2 bg-white text-[#E84D1C] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E84D1C] shadow-sm z-10">
                                    Answer
                                </span>
                                {faq.a}
                                {/* Tail */}
                                <div className="absolute bottom-[-2px] right-[-10px] w-0 h-0 border-t-[0px] border-t-transparent border-l-[10px] border-l-brand-50 border-b-[10px] border-b-transparent z-0"></div>
                                <div className="absolute bottom-[0px] right-[-8px] w-0 h-0 border-t-[0px] border-t-transparent border-l-[8px] border-l-white border-b-[8px] border-b-transparent z-10"></div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    )
}
