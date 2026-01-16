import { Plus } from 'lucide-react'

const FAQItem = ({ q, a }: { q: string, a: string }) => (
    <div className="bg-white border-2 border-brand-100 rounded-2xl p-6 relative overflow-hidden group hover:border-brand-300 transition-colors">
        <div className="flex items-start gap-4">
            <div className="bg-brand-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
                Q
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-2">{q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
        </div>
    </div>
)

export const FAQO = () => {
    return (
        <div id="faq" className="w-full bg-brand-50 py-16 px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-500 font-maru mb-2">よくあるご質問</h2>
                <p className="text-gray-400 text-xs font-bold tracking-widest">FAQ</p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
                <FAQItem
                    q="誰でも参加できますか？"
                    a="はい、スマートフォンをお持ちの方ならどなたでもご参加いただけます。"
                />
                <FAQItem
                    q="参加費はかかりますか？"
                    a="完全無料です。入賞者には素敵なプレゼントもご用意しています！"
                />
                <FAQItem
                    q="写真は公開されますか？"
                    a="コンテストページにて公開されます。ニックネームでの参加も可能です。"
                />
            </div>
        </div>
    )
}
