import Link from 'next/link'

export function CTAO() {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-xl border-4 border-orange-50">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#E84D1C 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                <div className="relative z-10 space-y-6">
                    <div className="w-16 h-16 bg-orange-100 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800">自慢の一枚、待ってます</h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
                        入賞者には「スクールフォト！お値引きクーポン」など<br className="hidden md:block" />
                        素敵なプレゼントをご用意しています。
                    </p>
                    <div className="pt-4">
                        <Link href="#" className="inline-block px-12 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-brand/30 hover:-translate-y-1">
                            無料で参加する
                        </Link>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">募集期間：2025年12月31日まで</p>
                </div>
            </div>
        </section>
    )
}
