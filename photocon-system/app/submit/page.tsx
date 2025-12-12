'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Contest {
  id: string
  name: string
  description: string | null
  status: string
}

export default function SubmitPage() {
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

  useEffect(() => {
    // アクティブなコンテスト一覧を取得
    const fetchContests = async () => {
      const response = await fetch('/api/contests')
      if (response.ok) {
        const data = await response.json()
        setContests(data)
        if (data.length === 1) {
          setSelectedContest(data[0].id)
        }
      }
    }
    fetchContests()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // ファイルサイズチェック (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('ファイルサイズは10MB以下にしてください')
        return
      }
      // ファイル形式チェック
      if (!selectedFile.type.startsWith('image/')) {
        setError('画像ファイルを選択してください')
        return
      }
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!selectedContest) {
        throw new Error('コンテストを選択してください')
      }
      if (!file) {
        throw new Error('写真を選択してください')
      }
      if (!nickname.trim()) {
        throw new Error('ニックネームを入力してください')
      }
      if (!email.trim()) {
        throw new Error('メールアドレスを入力してください')
      }
      // 簡易メールアドレスバリデーション
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('正しいメールアドレスを入力してください')
      }

      // FormDataでAPIに送信
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">投稿完了!</h1>
          <p className="text-gray-600 mb-6">
            ご応募ありがとうございます。<br />
            審査後、ギャラリーに掲載されます。
          </p>
          <div className="space-y-3">
            <Link
              href="/gallery"
              className="block w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
            >
              ギャラリーを見る
            </Link>
            <button
              onClick={() => {
                setSuccess(false)
                setFile(null)
                setPreview(null)
                setNickname('')
                setEmail('')
                setTitle('')
                setDescription('')
              }}
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              別の写真を投稿する
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/logo.png"
              alt="スクールフォト!"
              width={200}
              height={50}
              className="h-10 w-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">写真を投稿</h1>
          <p className="text-gray-600">フォトコンテストに参加しよう!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* コンテスト選択 */}
          {contests.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                参加するコンテスト *
              </label>
              <select
                value={selectedContest}
                onChange={(e) => setSelectedContest(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">選択してください</option>
                {contests.map((contest) => (
                  <option key={contest.id} value={contest.id}>
                    {contest.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 写真アップロード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              写真 *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                preview ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="プレビュー"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setPreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600">クリックして写真を選択</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG (最大10MB)</p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* ニックネーム */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム *
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="表示名を入力"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              maxLength={50}
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">入賞時のご連絡に使用します（公開されません）</p>
          </div>

          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル（任意）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="作品のタイトル"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              コメント（任意）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="写真についてのコメント"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              maxLength={500}
            />
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-4 rounded-lg font-bold text-lg transition ${
              loading || !file
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {loading ? '送信中...' : '投稿する'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            投稿された写真は審査後、ギャラリーに掲載されます。<br />
            不適切な内容は掲載されない場合があります。
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            ← トップに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
