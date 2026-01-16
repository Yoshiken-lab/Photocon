import Link from 'next/link'
import Image from 'next/image'

export function ActiveEventO() {
    return (
        <>
            {/* Real-time Status Section */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: Stats */}
                        <div className="text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="font-bold text-sm">リアルタイム更新中</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">今、みんなが参加しています！</h2>
                            <p className="text-gray-500 mb-6">たくさんの素敵な写真が届いています。<br />あなたも一緒に参加しませんか？</p>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-brand">128</div>
                                    <div className="text-xs text-gray-500">応募作品</div>
                                </div>
                                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-brand">89</div>
                                    <div className="text-xs text-gray-500">参加者</div>
                                </div>
                                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-red-500">12日</div>
                                    <div className="text-xs text-gray-500">残り</div>
                                </div>
                            </div>

                            <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold transition-all shadow-lg shadow-brand/30 hover:-translate-y-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                私も応募する
                            </Link>
                        </div>

                        {/* Right: Recent Applicants */}
                        <div className="bg-gray-50 rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    最近の応募
                                </h3>
                                <span className="text-xs text-gray-400">自動更新</span>
                            </div>

                            <div className="space-y-3">
                                <ApplicantRow name="mama_smile_123さん" time="たった今応募しました 🎉" isNew={true} color="bg-orange-100" />
                                <ApplicantRow name="papa_photoさん" time="3分前に応募しました" color="bg-blue-100" />
                                <ApplicantRow name="happy_familyさん" time="5分前に応募しました" color="bg-green-100" />
                                <ApplicantRow name="kids_loveさん" time="8分前に応募しました" color="bg-purple-100" />
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-500">今日だけで<span className="font-bold text-brand">12人</span>が応募中！</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">開催中のイベント</h2>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-white rounded-[2rem] p-6 md:p-10 shadow-xl border-2 border-brand-100">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span>募集中</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">🌸 春のフォトコンテスト</h3>
                                <p className="text-gray-500">テーマ：「新生活」</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span>📅 1/1 〜 3/31</span>
                                    <span>👥 応募 128件</span>
                                    <span>⏰ 残り 12日</span>
                                </div>
                                <div className="pt-4 flex flex-wrap gap-3">
                                    <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold transition-all shadow-lg">
                                        今すぐ応募する
                                    </Link>
                                    <Link href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-brand-100 text-gray-600 rounded-full font-bold transition-all hover:border-brand hover:text-brand">
                                        応募作品を見る
                                    </Link>
                                </div>
                            </div>
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative">
                                <Image src="https://picsum.photos/600/450?random=event" alt="Sample Event" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

function ApplicantRow({ name, time, isNew = false, color }: { name: string, time: string, isNew?: boolean, color: string }) {
    return (
        <div className={`flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm ${isNew ? 'border-l-4 border-brand' : ''}`}>
            <div className={`w-12 h-12 ${color} rounded-full overflow-hidden relative`}>
                <Image src={`https://picsum.photos/100/100?random=${name}`} alt="" fill className="object-cover" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-sm text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
            {isNew && <span className="bg-brand text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">NEW</span>}
        </div>
    )
}
