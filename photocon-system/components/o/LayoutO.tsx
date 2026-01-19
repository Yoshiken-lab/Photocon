'use client'

import Link from 'next/link'
import { ArrowRight, Stamp, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'

// --- Side Content Components ---

const LeftSidebar = () => (
    <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="hidden md:block w-64 pt-10 sticky top-28 self-start h-fit z-20"
    >
        {/* Redesigned Sidebar: Blends into background */}
        <div className="w-full pl-4">
            {/* Logo */}
            {/* Logo - Removed as per request */}
            <div className="mb-8 relative z-10 w-40">
                {/* Empty or removed */}
            </div>

            <ul className="space-y-5 font-bold text-stone-800 text-sm tracking-wide">
                {[
                    { href: "#howto", label: "応募方法" },
                    { href: "#events", label: "開催イベント" },
                    { href: "#faq", label: "Q&A" },
                    { href: "#contact", label: "お問い合わせ" }
                ].map((item, i) => (
                    <li key={item.href}>
                        <Link href={item.href} className="hover:text-brand-600 flex items-center gap-3 group transition-colors">
                            <span className="bg-stone-800/10 p-1.5 rounded-full group-hover:bg-brand-600 group-hover:text-white transition-all text-stone-800">
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="mt-12 flex justify-start opacity-60 pl-2">
                {/* Stamp Icon - Dark version */}
                <div className="border-4 border-stone-800/20 rounded-full p-2 rotate-12">
                    <Stamp className="text-stone-800/40 w-12 h-12" />
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
        className="hidden md:block w-64 pt-20 sticky top-28 self-start h-fit z-20 pl-8 pointer-events-none"
    >
        {/* Vertical Catchphrase - Removed as per request */}
        <div className="h-[400px] relative flex justify-end">
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
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true)
            } else {
                setShowScrollTop(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className="relative w-full bg-[#FFF5F0] min-h-screen flex justify-center pt-20 pb-20">
            <div className="relative w-full max-w-[1600px] flex justify-center md:justify-between items-start px-4 md:px-12">
                <LeftSidebar />

                {/* Central Content Column - Flat & Integrated */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-[600px] lg:w-[700px] relative z-10 flex flex-col items-center"
                >
                    {children}
                </motion.div>

                <RightSidebar />
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 bg-white text-brand-500 p-4 rounded-full shadow-lg border-2 border-brand-100 hover:shadow-xl transition-shadow"
                    >
                        <ArrowUp size={24} strokeWidth={3} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}
