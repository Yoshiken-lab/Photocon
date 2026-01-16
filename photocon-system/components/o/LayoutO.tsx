'use client'

import Link from 'next/link'
import { ArrowRight, Stamp } from 'lucide-react'
import { motion } from 'framer-motion'

// --- Side Content Components ---

const LeftSidebar = () => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="hidden md:block w-64 pt-10 sticky top-28 h-fit z-20"
    >
        <div className="bg-white rounded-[2rem] p-6 shadow-xl w-full">
            <div className="text-brand-500 font-bold mb-4 border-b-2 border-brand-100 pb-2">機能マップ</div>
            <ul className="space-y-4 font-bold text-gray-600 text-sm">
                {[
                    { href: "#howto", label: "応募方法" },
                    { href: "#events", label: "開催イベント" },
                    { href: "#faq", label: "Q&A" },
                    { href: "#contact", label: "お問い合わせ" }
                ].map((item, i) => (
                    <li key={item.href}>
                        <Link href={item.href} className="hover:text-brand-500 flex items-center gap-2 group">
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="mt-8 flex justify-center opacity-50">
                {/* Stamp Icon */}
                <div className="border-4 border-brand-200 rounded-full p-2 rotate-12">
                    <Stamp className="text-brand-300 w-12 h-12" />
                </div>
            </div>
        </div>

        {/* Floating Photo Decor Left */}
        <motion.div
            animate={{ y: [0, -10, 0], rotate: [-6, -4, -6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[400px] left-[-20px] w-40 bg-white p-2 shadow-lg hidden lg:block"
        >
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs">Family</div>
            </div>
        </motion.div>
    </motion.div>
)

const RightSidebar = () => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="hidden md:block w-64 pt-20 sticky top-28 h-fit z-20 pl-8 pointer-events-none"
    >
        {/* Vertical Catchphrase */}
        <div className="h-[400px] relative">
            <h1 className="writing-vertical-rl text-white font-maru font-bold text-4xl tracking-widest leading-relaxed drop-shadow-md opacity-90">
                あの日の一瞬を、<br />
                未来の宝物に。
            </h1>
        </div>

        {/* Floating Polaroids Right */}
        <motion.div
            animate={{ y: [0, -15, 0], rotate: [12, 10, 12] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[350px] right-[-20px] w-36 bg-white p-2 shadow-lg hidden lg:block"
        >
            <div className="aspect-square bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs">Crying Baby</div>
            </div>
        </motion.div>

        <motion.div
            animate={{ y: [0, 10, 0], rotate: [-12, -14, -12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[50px] right-[-40px] w-32 bg-white p-2 shadow-lg opacity-80 hidden lg:block"
        >
            <div className="aspect-square bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs">High Five</div>
            </div>
        </motion.div>
    </motion.div>
)

export const LayoutO = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative w-full bg-brand-500 min-h-screen overflow-x-hidden flex justify-center pt-20 pb-20">
            <div className="relative w-full max-w-[1600px] flex justify-center md:justify-between px-4 md:px-12">
                <LeftSidebar />

                {/* Central Content Column */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-[600px] lg:w-[700px] bg-white rounded-3xl shadow-2xl relative z-10 flex flex-col items-center overflow-hidden"
                >
                    {children}
                </motion.div>

                <RightSidebar />
            </div>
        </div>
    )
}
