'use client'

import { useEffect } from 'react'

// 30分（ミリ秒）
const SESSION_TIMEOUT = 30 * 60 * 1000

// デバイスタイプを判定
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const userAgent = navigator.userAgent.toLowerCase()

  // タブレット判定（iPadやAndroidタブレット）
  if (/ipad|android(?!.*mobile)/i.test(userAgent)) {
    return 'tablet'
  }

  // モバイル判定
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(userAgent)) {
    return 'mobile'
  }

  return 'desktop'
}

// UUIDを生成
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// visitor_idを取得または生成
function getVisitorId(): string {
  const STORAGE_KEY = 'photocon_visitor_id'

  let visitorId = localStorage.getItem(STORAGE_KEY)

  if (!visitorId) {
    visitorId = generateUUID()
    localStorage.setItem(STORAGE_KEY, visitorId)
  }

  return visitorId
}

// セッション内で既に記録済みかチェック
function shouldRecordPageView(): boolean {
  const LAST_ACCESS_KEY = 'photocon_last_access'

  const lastAccess = sessionStorage.getItem(LAST_ACCESS_KEY)
  const now = Date.now()

  if (lastAccess) {
    const lastAccessTime = parseInt(lastAccess, 10)
    // 30分以内なら記録しない
    if (now - lastAccessTime < SESSION_TIMEOUT) {
      return false
    }
  }

  // アクセス時刻を更新
  sessionStorage.setItem(LAST_ACCESS_KEY, now.toString())
  return true
}

// ページビューを記録
async function recordPageView() {
  try {
    const visitorId = getVisitorId()
    const deviceType = getDeviceType()

    const response = await fetch('/api/page-views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        deviceType,
      }),
    })

    if (!response.ok) {
      console.error('Failed to record page view')
    }
  } catch (error) {
    // エラーは握りつぶす（ユーザー体験に影響させない）
    console.error('Page view tracking error:', error)
  }
}

export function PageViewTracker() {
  useEffect(() => {
    // セッション内で30分以上経過していれば記録
    if (shouldRecordPageView()) {
      recordPageView()
    }
  }, [])

  // UIを持たないコンポーネント
  return null
}
