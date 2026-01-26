'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Camera, Upload, Check, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Contest {
    id: string
    name: string
    description: string | null
    status: string
}

export default function SubmitPageO() {
    const [contests, setContests] = useState<Contest[]>([])
    const [selectedContest, setSelectedContest] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [isDragOver, setIsDragOver] = useState(false)

    useEffect(() => {
        const fetchContests = async () => {
            try {
                // Use Server Action instead of fetch('/api/contests')
                const { getActiveContests } = await import('@/app/actions/sample-o')
                const data = await getActiveContests()

                setContests(data)
                if (data.length > 0) {
                    setSelectedContest(data[0].id)
                }
            } catch (e) {
                console.error("Failed to fetch contests", e)
            }
        }
        fetchContests()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        validateAndSetFile(selectedFile)
    }

    const validateAndSetFile = (selectedFile: File | undefined) => {
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('ファイルサイズは10MB以下にしてください')
                return
            }
            if (!selectedFile.type.startsWith('image/')) {
                setError('画像ファイルを選択してください')
                return
            }
            setFile(selectedFile)
            setPreview(URL.createObjectURL(selectedFile))
            setError('')
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        const droppedFile = e.dataTransfer.files[0]
        validateAndSetFile(droppedFile)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!selectedContest) throw new Error('コンテストを選択してください')
            if (!file) throw new Error('写真を選択してください')
            if (!nickname.trim()) throw new Error('ニックネームを入力してください')
            if (!email.trim()) throw new Error('メールアドレスを入力してください')
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) throw new Error('正しいメールアドレスを入力してください')

            const formData = new FormData()
            formData.append('file', file)
            formData.append('contestId', selectedContest)
            formData.append('nickname', nickname)
            formData.append('email', email)
            formData.append('title', title)
            formData.append('description', description)

            const response = await fetch('/api/entries', {
                method: 'POST',
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || '送信に失敗しました')
            }

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : '送信に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    // --- Success View ---
    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-sans">
                <div className="w-full max-w-[700px] min-h-screen bg-[#FFF5F0] flex items-center justify-center p-6 shadow-2xl shadow-brand-100/20 border-x border-brand-100/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border-4 border-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#E84D1C]"></div>

                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-800 mb-3 font-maru">投稿完了！</h1>
                        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                            ご応募ありがとうございます。<br />
                            審査後、ギャラリーに掲載されます。
                        </p>

                        <div className="space-y-4">
                            <Link
                                href="/sample-o"
                                className="block w-full bg-[#E84D1C] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#D63E0F] hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            >
                                トップへ戻る
                            </Link>
                            <button
                                onClick={() => {
                                    setSuccess(false)
                                    setFile(null)
                                    setPreview(null)
                                    setTitle('')
                                    setDescription('')
                                    // Keep name/email for easier consecutive submissions
                                }}
                                className="block w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                続けて投稿する
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    // --- Form View ---
    return (
        <div className="min-h-screen bg-white font-sans flex justify-center">
            <div className="w-full max-w-[700px] min-h-screen bg-[#FFF5F0] py-12 px-4 md:px-6 relative shadow-2xl shadow-brand-100/20 border-x border-brand-100/50">
                {/* Background Decor */}
                <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-100/50 rounded-full blur-3xl pointer-events-none" />
                <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                    <Link href="/sample-o" className="flex items-center gap-2 text-gray-500 hover:text-[#E84D1C] transition-colors font-bold group">
                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="hidden md:inline">トップへ戻る</span>
                    </Link>
                    <div className="w-32 md:w-40 opacity-50">
                        {/* Placeholder for Logo if needed, or keep simple */}
                    </div>
                </header>

                <div className="max-w-2xl mx-auto relative z-20 mt-8">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block bg-white px-6 py-2 rounded-full shadow-sm mb-4"
                        >
                            <span className="text-[#E84D1C] font-bold tracking-widest text-sm">ENTRY FORM</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-extrabold text-gray-800 font-maru mb-4"
                        >
                            写真を投稿する
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-500 font-medium"
                        >
                            あなたの自慢の1枚を送ってください！
                        </motion.p>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 space-y-8 relative overflow-hidden"
                    >
                        {/* Top Border Accent */}
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-300 to-[#E84D1C]"></div>

                        {/* Contest Selection */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-bold font-maru text-lg">
                                参加するコンテスト <span className="text-[#E84D1C]">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedContest}
                                    onChange={(e) => setSelectedContest(e.target.value)}
                                    className="w-full appearance-none bg-gray-50 border-2 border-gray-100 text-gray-700 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:border-[#E84D1C] focus:bg-white transition-all cursor-pointer"
                                    required
                                >
                                    {contests.length > 0 ? (
                                        contests.map((contest) => (
                                            <option key={contest.id} value={contest.id}>
                                                {contest.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">コンテストを読み込み中...</option>
                                    )}
                                </select>
                                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <ChevronDown size={24} />
                                </div>
                            </div>
                        </div>

                        {/* File Upload Area */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-bold font-maru text-lg">
                                写真 <span className="text-[#E84D1C]">*</span>
                            </label>

                            <div
                                className={`relative border-3 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 group
                ${preview ? 'border-[#E84D1C] bg-orange-50/50' : 'border-gray-200 hover:border-[#E84D1C] hover:bg-gray-50'}
                ${isDragOver ? 'scale-[1.02] border-[#E84D1C] bg-orange-50' : ''}
              `}
                                onClick={() => document.getElementById('file-input')?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <AnimatePresence>
                                    {preview ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative inline-block"
                                        >
                                            <div className="p-2 bg-white rounded-2xl shadow-sm rotate-[-2deg] transition-transform group-hover:rotate-0 duration-300">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-h-80 w-auto rounded-xl object-contain mx-auto"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setFile(null)
                                                    setPreview(null)
                                                }}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 hover:scale-110 transition-all"
                                            >
                                                <span className="sr-only">削除</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                            <p className="mt-4 text font-bold text-[#E84D1C]">画像を変更する</p>
                                        </motion.div>
                                    ) : (
                                        <div className="py-8">
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#E84D1C]/10 transition-all duration-300">
                                                <Camera className="w-10 h-10 text-gray-400 group-hover:text-[#E84D1C] transition-colors" />
                                            </div>
                                            <p className="text-xl font-bold text-gray-600 mb-2">写真をここへドロップ</p>
                                            <p className="text-gray-400 text-sm font-medium">またはクリックして選択</p>
                                            <div className="mt-6 inline-flex items-center gap-2 bg-[#E84D1C] text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-shadow">
                                                <Upload size={16} />
                                                ファイルを選択
                                            </div>
                                            <p className="text-xs text-gray-400 mt-4">JPG, PNG (最大10MB)</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Nickname */}
                            <div className="space-y-3">
                                <label className="block text-gray-700 font-bold font-maru text-lg">
                                    ニックネーム <span className="text-[#E84D1C]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="例: たろう"
                                    className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-[#E84D1C] focus:bg-white transition-all placeholder:text-gray-300"
                                    required
                                    maxLength={50}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="block text-gray-700 font-bold font-maru text-lg">
                                    メールアドレス <span className="text-[#E84D1C]">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-[#E84D1C] focus:bg-white transition-all placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-bold font-maru text-lg">
                                タイトル <span className="text-gray-400 text-sm font-normal ml-2">(任意)</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="作品のタイトル"
                                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-[#E84D1C] focus:bg-white transition-all placeholder:text-gray-300"
                                maxLength={100}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-bold font-maru text-lg">
                                コメント <span className="text-gray-400 text-sm font-normal ml-2">(任意)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="写真のエピソードなどを教えてください"
                                rows={4}
                                className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 rounded-2xl px-5 py-4 font-medium focus:outline-none focus:border-[#E84D1C] focus:bg-white transition-all placeholder:text-gray-300 resize-none"
                                maxLength={500}
                            />
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-50 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3 font-bold"
                                >
                                    <AlertCircle size={24} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className={`w-full py-5 rounded-full font-extrabold text-xl shadow-xl transform transition-all duration-200 relative overflow-hidden group
              ${loading || !file
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#E84D1C] text-white hover:bg-[#D63E0F] hover:shadow-2xl hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    送信中...
                                </span>
                            ) : (
                                'この内容で応募する'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-gray-500 mt-2">
                                ※ 不適切な画像（著作権侵害・公序良俗に反するもの）は削除される場合があります。
                            </p>
                        </div>
                    </motion.form>

                    <div className="h-20"></div> {/* Spacer */}
                </div>
            </div>
        </div>
    )
}
