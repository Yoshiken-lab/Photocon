'use client'

import { Upload, Camera, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export const HowToApplyO = () => {
    return (
        <div id="howto" className="w-full bg-orange-50 py-16 px-6 relative overflow-hidden">
            {/* Diagonal Header Decoration */}
            <div className="absolute top-0 left-0 w-full h-12 bg-white skew-y-2 origin-top-right transform -translate-y-6"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12 relative z-10"
            >
                <div className="inline-block bg-white px-8 py-2 rounded-full shadow-sm mb-4">
                    <span className="text-brand-500 font-bold tracking-widest">STEP</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 font-maru">
                    かんたん3ステップ<br />
                    <span className="text-brand-500">応募方法</span>
                </h2>
            </motion.div>

            <div className="space-y-6 max-w-sm mx-auto relative z-10">
                {/* Step 1 */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 relative group hover:-translate-y-1 transition-transform"
                >
                    <div className="absolute -top-3 -left-3 bg-brand-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                    <div className="bg-orange-100 p-4 rounded-full text-brand-500">
                        <Camera size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">写真を選ぶ</h3>
                        <p className="text-xs text-gray-500 mt-1">スマホにある写真でOK!</p>
                    </div>
                </motion.div>

                {/* Connector Line */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 24 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="w-0.5 bg-brand-200 mx-auto"
                ></motion.div>

                {/* Step 2 */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 relative group hover:-translate-y-1 transition-transform"
                >
                    <div className="absolute -top-3 -left-3 bg-brand-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                    <div className="bg-orange-100 p-4 rounded-full text-brand-500">
                        <Upload size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">アップロード</h3>
                        <p className="text-xs text-gray-500 mt-1">応募フォームから送信</p>
                    </div>
                </motion.div>

                {/* Connector Line */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 24 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="w-0.5 bg-brand-200 mx-auto"
                ></motion.div>

                {/* Step 3 */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-6 relative group hover:-translate-y-1 transition-transform"
                >
                    <div className="absolute -top-3 -left-3 bg-brand-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                    <div className="bg-orange-100 p-4 rounded-full text-brand-500">
                        <Heart size={32} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">公開・投票</h3>
                        <p className="text-xs text-gray-500 mt-1">みんなの作品を楽しもう</p>
                    </div>
                </motion.div>
            </div>

            {/* Footer Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-white skew-y-[-2deg] origin-bottom-left transform translate-y-6"></div>
        </div>
    )
}
