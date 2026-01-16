export function AboutO() {
    return (
        <section className="py-20 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-brand font-bold text-lg md:text-xl bg-orange-50 px-6 py-3 rounded-full mb-3 inline-block">かんたん 3ステップ</span>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800 mb-4">ママ・パパのための<br />やさしいコンテスト</h2>
                    <p className="text-gray-500 text-sm">難しい操作はいりません。<br />いつものスマホ操作だけで参加できます。</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 md:gap-10">
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center text-brand mb-6 transition-transform group-hover:scale-110 rotate-3 group-hover:rotate-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-3">1. 写真を選ぶ</h3>
                        <p className="text-gray-500 text-sm leading-7">スマホのアルバムから、<br />お気に入りの1枚を選びます。</p>
                    </div>

                    <div className="text-center group">
                        <div className="relative w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center text-brand mb-6 transition-transform group-hover:scale-110 -rotate-2 group-hover:-rotate-6">
                            <div className="absolute -right-2 -top-2 bg-yellow-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">!</div>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-3">2. アップロード</h3>
                        <p className="text-gray-500 text-sm leading-7">そのままアップロードするか、<br />Instagramでタグ付け投稿でもOK。</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-orange-50 rounded-2xl flex items-center justify-center text-brand mb-6 transition-transform group-hover:scale-110 rotate-3 group-hover:rotate-6">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold mb-3">3. みんなで応援</h3>
                        <p className="text-gray-500 text-sm leading-7">素敵な作品にハートを送ろう。<br />入賞作品はサイトで表彰！</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
