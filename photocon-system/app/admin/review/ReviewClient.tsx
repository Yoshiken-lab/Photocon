'use client'

import { useState, useRef, MouseEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateEntryStatus } from '@/app/actions/entries'
import { Check, X, Inbox, User, Tag, ExternalLink, Clock, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import Image from 'next/image'

// 画像読み込みエラー時のフォールバックコンポーネント
function ImageWithFallback({ src, alt, className }: { src: string; alt: string; fill?: boolean; className?: string }) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className} h-full w-full`}>
        <div className="text-center">
          <ImageOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No Image</p>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

interface Entry {
  id: string
  media_url: string
  username: string
  caption: string | null
  instagram_permalink: string | null
  collected_at: string
  contests: { name: string; theme: string | null } | null
  categories: { name: string } | null
}

interface ReviewClientProps {
  entries: Entry[]
  totalCount?: number
  currentPage?: number
  perPage?: number
}

export function ReviewClient({
  entries: initialEntries,
  totalCount = 0,
  currentPage = 1,
  perPage = 20
}: ReviewClientProps) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(initialEntries[0]?.id || null)
  const [isProcessing, setIsProcessing] = useState(false)

  const router = useRouter()

  const totalPages = Math.ceil(totalCount / perPage)

  // 虫眼鏡用のstate
  const MAGNIFIER_SIZE = 144 // w-36 = 144px
  const ZOOM_LEVEL = 2.5 // 拡大倍率

  const [magnifier, setMagnifier] = useState<{
    x: number; y: number;
    bgX: number; bgY: number;
    bgWidth: number; bgHeight: number;
    show: boolean
  }>({ x: 0, y: 0, bgX: 0, bgY: 0, bgWidth: 0, bgHeight: 0, show: false })
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const selectedEntry = entries.find(e => e.id === selectedEntryId)

  // 選択されたエントリーが変わったら画像の自然サイズを取得
  useEffect(() => {
    if (selectedEntry?.media_url) {
      const img = new window.Image()
      img.onload = () => {
        setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.src = selectedEntry.media_url
    }
    // 虫眼鏡をリセット
    setMagnifier(prev => ({ ...prev, show: false }))
  }, [selectedEntry?.media_url])

  // 虫眼鏡のマウスイベントハンドラ
  const handleMagnifierMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageNaturalSize || !imageContainerRef.current) {
      setMagnifier(prev => ({ ...prev, show: false }))
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const containerWidth = rect.width
    const containerHeight = rect.height

    // 画像の自然なアスペクト比と表示領域のアスペクト比を比較
    const imageAspect = imageNaturalSize.width / imageNaturalSize.height
    const containerAspect = containerWidth / containerHeight

    let displayWidth: number, displayHeight: number, offsetX: number, offsetY: number

    if (imageAspect > containerAspect) {
      // 画像が横長: 幅いっぱいに表示、上下に余白
      displayWidth = containerWidth
      displayHeight = containerWidth / imageAspect
      offsetX = 0
      offsetY = (containerHeight - displayHeight) / 2
    } else {
      // 画像が縦長: 高さいっぱいに表示、左右に余白
      displayHeight = containerHeight
      displayWidth = containerHeight * imageAspect
      offsetX = (containerWidth - displayWidth) / 2
      offsetY = 0
    }

    // マウス位置（コンテナ内）
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // マウスが画像の表示領域内かチェック
    const isInsideImage =
      mouseX >= offsetX &&
      mouseX <= offsetX + displayWidth &&
      mouseY >= offsetY &&
      mouseY <= offsetY + displayHeight

    if (!isInsideImage) {
      setMagnifier(prev => ({ ...prev, show: false }))
      return
    }

    // コンテナ内での位置（%）- 虫眼鏡の表示位置
    const x = (mouseX / containerWidth) * 100
    const y = (mouseY / containerHeight) * 100

    // 画像内でのマウス位置（画像の左上からの相対位置）
    const imageMouseX = mouseX - offsetX
    const imageMouseY = mouseY - offsetY

    // 虫眼鏡内の背景画像サイズ（表示サイズ × ズーム倍率）
    const bgWidth = displayWidth * ZOOM_LEVEL
    const bgHeight = displayHeight * ZOOM_LEVEL

    // 背景位置の計算（マウス位置が虫眼鏡の中央に来るように）
    const bgX = -(imageMouseX * ZOOM_LEVEL) + MAGNIFIER_SIZE / 2
    const bgY = -(imageMouseY * ZOOM_LEVEL) + MAGNIFIER_SIZE / 2

    setMagnifier({ x, y, bgX, bgY, bgWidth, bgHeight, show: true })
  }

  const handleMagnifierLeave = () => {
    setMagnifier(prev => ({ ...prev, show: false }))
  }

  // ページ変更ハンドラ
  const handlePageChange = (newPage: number) => {
    router.push(`/admin/review?page=${newPage}`)
    router.refresh()
  }

  // 承認・却下等の処理
  const handleProcessEntry = async (status: 'approved' | 'rejected') => {
    if (!selectedEntryId || isProcessing) return
    setIsProcessing(true)

    try {
      await updateEntryStatus(selectedEntryId, status)

      // 成功したらリストから削除
      const newEntries = entries.filter(e => e.id !== selectedEntryId)
      setEntries(newEntries)

      // 次のエントリーを自動選択
      if (newEntries.length > 0) {
        // 現在のインデックスを探して、同じ位置か前の位置のものを選択
        const processedIndex = entries.findIndex(e => e.id === selectedEntryId)
        const nextEntry = newEntries[processedIndex] || newEntries[processedIndex - 1] || newEntries[0]
        setSelectedEntryId(nextEntry.id)
      } else {
        setSelectedEntryId(null)
        // ページ内のアイテムがなくなった場合、かつ次のページがあるならリロード等の処理が理想的
        // ここではシンプルに router.refresh() することで、データが再フェッチされるのを期待する
        if (totalPages > 1) {
          router.refresh()
        }
      }

      router.refresh()
    } catch (error) {
      console.error(`Failed to ${status} entry:`, error)
      alert('処理に失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  // 審査待ちがない場合
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-maru">全て完了しました！</h2>
        <p className="text-gray-500">現在審査待ちのエントリーはありません。</p>

        {/* Pagination controls even if empty (e.g. if we are on page 2 but all items processed) */}
        {totalPages > 1 && (
          <div className="mt-6">
            <button
              onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
              className="text-brand hover:underline"
            >
              前のページへ戻る
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* LEFT: Entry List */}
      <div className="w-full lg:w-1/4 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-gray-500" />
            <span className="font-bold text-gray-700">審査待ち</span>
            <span className="bg-brand text-white text-xs px-2 py-0.5 rounded-full font-bold">{totalCount}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelectedEntryId(entry.id)}
              className={`w-full text-left p-3 border-b border-gray-100 transition-colors flex gap-3 hover:bg-white focus:outline-none ${selectedEntryId === entry.id ? 'bg-white border-l-4 border-l-brand shadow-sm' : 'border-l-4 border-l-transparent text-gray-600'
                }`}
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 relative flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                <ImageWithFallback
                  src={entry.media_url}
                  alt=""
                  className="object-cover"
                />
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold truncate ${selectedEntryId === entry.id ? 'text-gray-900' : 'text-gray-700'}`}>
                    @{entry.username}
                  </span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {new Date(entry.collected_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate mb-1">
                  {entry.contests?.name || 'コンテスト未設定'}
                </div>
                {entry.caption && (
                  <p className="text-[10px] text-gray-400 truncate">
                    {entry.caption}
                  </p>
                )}
              </div>
            </button>
          ))}

          {/* Pagination Controls in List Footer */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50 text-xs">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-2 py-1 rounded bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-gray-500">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-2 py-1 rounded bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Detail View */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {selectedEntry ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">@{selectedEntry.username}</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>ID: {selectedEntry.id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedEntry.collected_at).toLocaleString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEntry.instagram_permalink && (
                <a
                  href={selectedEntry.instagram_permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-brand hover:underline border border-brand-100 px-3 py-1.5 rounded-full hover:bg-brand-50 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Instagramで見る
                </a>
              )}
            </div>

            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
              <div className="flex flex-col h-full">
                {/* Large Image Preview with Magnifier */}
                <div
                  ref={imageContainerRef}
                  className="flex-1 flex items-center justify-center min-h-[400px] mb-4 bg-gray-200/50 rounded-xl border border-gray-200 overflow-hidden relative group cursor-crosshair"
                  onMouseMove={handleMagnifierMove}
                  onMouseLeave={handleMagnifierLeave}
                >
                  <div className="relative w-full h-full">
                    <ImageWithFallback
                      src={selectedEntry.media_url}
                      alt="応募作品"
                      className="object-contain"
                    />
                  </div>

                  {/* 虫眼鏡 */}
                  {magnifier.show && selectedEntry.media_url && (
                    <div
                      className="absolute w-36 h-36 rounded-full border-4 border-white shadow-2xl pointer-events-none z-10"
                      style={{
                        left: `${magnifier.x}%`,
                        top: `${magnifier.y}%`,
                        transform: 'translate(-50%, -50%)',
                        backgroundImage: `url(${selectedEntry.media_url})`,
                        backgroundSize: `${magnifier.bgWidth}px ${magnifier.bgHeight}px`,
                        backgroundPosition: `${magnifier.bgX}px ${magnifier.bgY}px`,
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  )}
                </div>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      応募情報
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-400">コンテスト名</p>
                        <p className="font-bold text-gray-800">{selectedEntry.contests?.name || '-'}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-gray-400">テーマ</p>
                          <p className="text-sm font-medium text-gray-700">{selectedEntry.contests?.theme || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">カテゴリ</p>
                          <p className="text-sm font-medium text-gray-700">{selectedEntry.categories?.name || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="text-xl leading-none">”</span>
                      キャプション
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.caption || '（キャプションなし）'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions (Sticky) */}
            <div className="p-4 bg-white border-t border-gray-200 flex justify-between items-center gap-4 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => handleProcessEntry('rejected')}
                disabled={isProcessing}
                className="flex-1 max-w-[200px] py-3 px-4 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                却下する
              </button>

              <div className="flex-1 text-center text-xs text-gray-400 hidden md:block">
                承認・却下すると自動的に次の画像が表示されます
              </div>

              <button
                onClick={() => handleProcessEntry('approved')}
                disabled={isProcessing}
                className="flex-1 max-w-[200px] py-3 px-4 bg-brand hover:bg-brand-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                承認する
              </button>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <p>エントリーを選択してください</p>
          </div>
        )}
      </div>

    </div>
  )
}
