'use client'

import React from 'react'

export const Requirements = () => {
    const requirements = [
        { label: '応募期間', value: '各イベントの情報をご確認ください。' },
        { label: '入選発表・作品掲載入選', value: 'イベント毎●名様 ※該当者なしの場合あり' },
        { label: '掲載', value: '掲載に問題が無いかを審査し、問題が無ければ随時掲載' },
        { label: '応募資格', value: 'プロ、アマチュア、年齢を問わず、どなたでも応募できます。' },
        { label: '応募作品', value: 'デジタルカメラやスマホ等で撮影されたデジタル画像データのみ\n（ファイルサイズ：5MB 以内、ファイル形式：JPEG）' },
        { label: '応募方法', value: 'コンテストホームページの応募フォームから応募してください。' },
        { label: '応募点数', value: '応募点数応募点数についての制限は特に無し（複数応募可）' },
        { label: '審査発表', value: '本コンテストホームページ上で発表いたします。\n※入選者および当選者の方へはメールにてご連絡いたします。' },
        { label: '応募作品について', value: '応募作品及び入選作品応募作品はギャラリーの掲載に使用します。' },
        { label: '審査方法', value: 'スクールフォト！にて厳正なる審査を行います。' },
        { label: '開催主催', value: 'スクールフォト！' },
    ]

    return (
        <section className="py-20 bg-brand-50">
            <div className="max-w-6xl mx-auto px-4">

                <div className="bg-brand-50 rounded-[3rem] p-8 md:p-16 border-8 border-white shadow-xl relative bg-white">

                    {/* Header Tab similar to prizes but integrated in card look */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-12 py-3 rounded-t-2xl shadow-sm">
                        <h2 className="text-2xl font-bold text-brand font-maru tracking-widest">募集要項</h2>
                    </div>

                    <div className="space-y-6 mt-8">
                        {requirements.map((req, index) => (
                            <div key={index} className="flex flex-col md:flex-row border-b border-gray-400 border-dashed pb-6 last:border-0">
                                <div className="w-full md:w-64 font-bold text-brand shrink-0 mb-2 md:mb-0">
                                    {req.label}
                                </div>
                                <div className="flex-1 text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                                    {req.value}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
