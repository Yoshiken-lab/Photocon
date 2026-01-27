'use client'

import { useState } from 'react'
import { X, Calendar, Image, Smile, Type, FileText, Hash } from 'lucide-react'
import { createContest, updateContest } from './actions'

type Contest = {
  id: string
  name: string
  description: string | null
  theme: string | null
  emoji: string | null
  image_url: string | null
  hashtags: string[] | null
  start_date: string
  end_date: string
  voting_start: string | null
  voting_end: string | null
  status: string
  settings?: { is_voting_enabled?: boolean }
}

type ContestFormProps = {
  isOpen: boolean
  onClose: () => void
  contest?: Contest | null
}

export default function ContestForm({ isOpen, onClose, contest }: ContestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!contest

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return dateString.split('T')[0]
  }

  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = isEditing
        ? await updateContest(contest!.id, formData)
        : await createContest(formData)
      if (result.error) {
        setError(result.error)
      } else {
        onClose()
        window.location.reload()
      }
    } catch (e) {
      setError('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'コンテスト編集' : '新規コンテスト作成'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                コンテスト名 *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={contest?.name || ''}
                placeholder="例：クリスマスフォトコンテスト"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                説明
              </label>
              <textarea
                name="description"
                rows={3}
                defaultValue={contest?.description || ''}
                placeholder="コンテストの説明を入力..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Smile className="w-4 h-4 inline mr-1" />
                テーマ
              </label>
              <input
                type="text"
                name="theme"
                defaultValue={contest?.theme || ''}
                placeholder="例：家族の笑顔"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Smile className="w-4 h-4 inline mr-1" />
                絵文字アイコン
              </label>
              <input
                type="text"
                name="emoji"
                defaultValue={contest?.emoji || ''}
                placeholder="例：🎄"
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                ハッシュタグ
              </label>
              <input
                type="text"
                name="hashtags"
                defaultValue={contest?.hashtags?.join(', ') || ''}
                placeholder="例：#クリスマス,#家族写真"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">カンマ区切りで複数入力可</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                サムネイル画像URL
              </label>
              <input
                type="url"
                name="image_url"
                defaultValue={contest?.image_url || ''}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                募集開始日 *
              </label>
              <input
                type="date"
                name="start_date"
                required
                defaultValue={formatDate(contest?.start_date || null)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                募集終了日 *
              </label>
              <input
                type="date"
                name="end_date"
                required
                defaultValue={formatDate(contest?.end_date || null)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="is_voting_enabled"
                  name="is_voting_enabled"
                  defaultChecked={contest?.settings?.is_voting_enabled ?? true}
                  className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                  onChange={(e) => {
                    const dateInputs = document.querySelectorAll('.voting-date-input')
                    dateInputs.forEach((input: any) => {
                      input.disabled = !e.target.checked
                      if (!e.target.checked) input.value = ''
                    })
                  }}
                />
                <label htmlFor="is_voting_enabled" className="font-bold text-gray-800 cursor-pointer select-none">
                  一般投票を受け付ける
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    投票開始日
                  </label>
                  <input
                    type="date"
                    name="voting_start"
                    defaultValue={formatDate(contest?.voting_start || null)}
                    className="voting-date-input w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={contest?.settings?.is_voting_enabled === false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    投票終了日
                  </label>
                  <input
                    type="date"
                    name="voting_end"
                    defaultValue={formatDate(contest?.voting_end || null)}
                    className="voting-date-input w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={contest?.settings?.is_voting_enabled === false}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                name="status"
                defaultValue={contest?.status || 'draft'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              >
                <option value="draft">下書き</option>
                <option value="upcoming">公開予定</option>
                <option value="active">開催中</option>
                <option value="voting">投票中</option>
                <option value="ended">終了</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (isEditing ? '更新中...' : '作成中...') : (isEditing ? '更新する' : '作成する')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
