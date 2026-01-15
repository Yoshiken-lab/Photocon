'use client'

export function PrizesF2() {
    return (
        <section className="bg-[#FFF5F0] pt-24 md:pt-40 pb-20 px-4 relative">
            <div className="max-w-4xl mx-auto">

                {/* Prizes Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-16 text-center shadow-sm relative overflow-hidden mb-20">
                    {/* Confetti decorations (Mock with absolute divs) */}
                    <div className="absolute top-10 left-10 w-4 h-4 bg-gray-200 rotate-12"></div>
                    <div className="absolute top-20 right-20 w-4 h-4 bg-gray-300 -rotate-12 opacity-50"></div>

                    {/* Ribbon/Title */}
                    <div className="text-3xl md:text-4xl font-bold font-maru text-brand-500 mb-12 relative z-10">
                        入賞特典
                    </div>

                    {/* Badge */}
                    <div className="inline-block bg-yellow-400 text-white font-bold py-3 px-10 rounded-full mb-8 relative shadow-md text-lg">
                        入選者 ● 名様に
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rotate-45"></div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl md:text-3xl font-bold text-gray-600 font-maru leading-relaxed">
                            入賞者には「スクールフォト！お値引きクーポン」など
                        </h3>
                        <p className="text-xl md:text-3xl font-bold text-gray-600 font-maru leading-relaxed">
                            素敵なプレゼントをご用意しています。
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export function RequirementsF2() {
    return (
        <section className="bg-[#FFF5F0] pt-0 pb-20 px-4 relative">
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-maru text-brand-500">
                        募集要項
                    </h2>
                </div>

                {/* Table */}
                <div className="bg-[#FFF5F0] rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y-2 divide-gray-300 border-t-2 border-b-2 border-gray-300">
                            <RequirementRow label="応募期間" value="各イベントの情報をご確認ください。" />
                            <RequirementRow label="入選発表・作品掲載入選" value="イベント毎●名様 ※該当者なしの場合あり" />
                            <RequirementRow label="掲載" value="掲載に問題が無いかを審査し、問題が無ければ随時掲載" />
                            <RequirementRow label="応募資格" value="プロ、アマチュア、年齢を問わず、どなたでも応募できます。" />
                            <RequirementRow label="応募作品" value="デジタルカメラやスマホ等で撮影されたデジタル画像データのみ（ファイルサイズ：5MB 以内、ファイル形式：JPEG）" />
                            <RequirementRow label="応募方法" value="コンテストホームページの応募フォームから応募してください。" />
                            <RequirementRow label="応募点数" value="応募点数応募点数についての制限は特に無し（複数応募可）" />
                            <RequirementRow label="審査発表" value="本コンテストホームページ上で発表いたします。※入選者および当選者の方へはメールにてご連絡いたします。" />
                            <RequirementRow label="応募作品について" value="応募作品及び入選作品応募作品はギャラリーの掲載に使用します。" />
                            <RequirementRow label="審査方法" value="スクールフォト！にて厳正なる審査を行います。" />
                            <RequirementRow label="開催主催" value="スクールフォト！" />
                        </tbody>
                    </table>
                </div>

            </div>
        </section>
    )
}

function RequirementRow({ label, value }: { label: string, value: string }) {
    return (
        <tr className="">
            <th className="py-6 px-4 md:px-8 font-bold text-brand-500 w-1/3 md:w-1/4 align-top">{label}</th>
            <td className="py-6 px-4 md:px-8 text-gray-600 font-medium leading-relaxed">{value}</td>
        </tr>
    )
}
