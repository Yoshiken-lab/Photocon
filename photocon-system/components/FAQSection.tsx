'use client'

import { Coins, Image as ImageIcon, Copy, FileCheck, Trash2 } from 'lucide-react'

const faqs = [
  {
    question: '無料で応募できますか？',
    answer: 'スマートフォンやパソコンがあれば無料で応募できます。テーマに沿ったお写真をご用意の上、ぜひご参加ください。',
    icon: Coins,
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'hover:border-orange-200'
  },
  {
    question: '子ども以外の写真（風景や動物など）も応募できますか？',
    answer: 'お子様が写っているお写真でご応募ください。',
    icon: ImageIcon,
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'hover:border-blue-200'
  },
  {
    question: '一人何枚まで応募できますか？',
    answer: '何枚でも応募できます。',
    icon: Copy,
    color: 'bg-green-100 text-green-600',
    borderColor: 'hover:border-green-200'
  },
  {
    question: '写真の形式や写真のサイズに制限はありますか？',
    answer: 'JPEG・JPG・PNGのみ対応しております。また、サイズに関しては15MBまで受け付けております。',
    icon: FileCheck,
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'hover:border-purple-200'
  },
  {
    question: '応募した写真を後から削除できますか？',
    answer: 'お写真の削除依頼に関しましては、「お問い合わせ」からお問い合わせください。',
    icon: Trash2,
    color: 'bg-red-100 text-red-600',
    borderColor: 'hover:border-red-200'
  }
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-4 bg-brand-50 scroll-mt-32">
      <div className="max-w-4xl mx-auto">
        {/* タイトル */}
        <div className="text-center mb-12">
          <span className="block text-xl font-bold text-brand font-maru mb-2">Q&A</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-maru">よくある質問</h2>
        </div>

        {/* FAQ一覧 Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-transparent ${faq.borderColor} group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${faq.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <faq.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-brand transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
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
