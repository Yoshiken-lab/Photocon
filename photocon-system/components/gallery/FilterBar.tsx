'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types/entry'

interface Props {
  categories: Category[]
  currentCategory?: string
  currentSort?: string
}

export function FilterBar({ categories, currentCategory, currentSort }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId)
    } else {
      params.delete('category')
    }
    router.push(`/gallery?${params.toString()}`)
  }

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sort === 'latest') {
      params.delete('sort')
    } else {
      params.set('sort', sort)
    }
    router.push(`/gallery?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 text-sm">
        <button
          onClick={() => handleCategoryChange()}
          className={`px-4 py-2 rounded-full font-bold shadow-sm transition-colors ${
            !currentCategory
              ? 'bg-brand text-white'
              : 'bg-white text-gray-500 hover:text-brand'
          }`}
        >
          すべて
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full font-bold shadow-sm transition-colors ${
              currentCategory === category.id
                ? 'bg-brand text-white'
                : 'bg-white text-gray-500 hover:text-brand'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* ソート */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => handleSortChange('latest')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            currentSort !== 'popular'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          新着順
        </button>
        <button
          onClick={() => handleSortChange('popular')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            currentSort === 'popular'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          人気順
        </button>
      </div>
    </div>
  )
}
