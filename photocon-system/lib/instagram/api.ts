import { InstagramMediaSchema, type InstagramMedia } from './types'

export class InstagramAPI {
  private accessToken: string
  private businessAccountId: string
  private baseUrl = 'https://graph.facebook.com/v19.0'

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN || ''
    this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || ''

    if (!this.accessToken || !this.businessAccountId) {
      console.warn('Instagram API credentials not configured')
    }
  }

  isConfigured(): boolean {
    return !!this.accessToken && !!this.businessAccountId
  }

  // ハッシュタグID取得
  async getHashtagId(hashtag: string): Promise<string> {
    const cleanHashtag = hashtag.replace('#', '')
    const url = `${this.baseUrl}/ig_hashtag_search?user_id=${this.businessAccountId}&q=${encodeURIComponent(cleanHashtag)}&access_token=${this.accessToken}`

    const res = await fetch(url)
    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Hashtag search failed: ${error.error?.message || res.status}`)
    }

    const data = await res.json()
    if (!data.data?.[0]?.id) {
      throw new Error(`Hashtag not found: ${hashtag}`)
    }

    return data.data[0].id
  }

  // 最近の投稿取得（ハッシュタグ検索）
  async getRecentHashtagMedia(hashtagId: string): Promise<InstagramMedia[]> {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count,username'
    const url = `${this.baseUrl}/${hashtagId}/recent_media?user_id=${this.businessAccountId}&fields=${fields}&access_token=${this.accessToken}`

    const res = await fetch(url)
    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Media fetch failed: ${error.error?.message || res.status}`)
    }

    const data = await res.json()

    return (data.data || []).map((item: unknown) => {
      try {
        return InstagramMediaSchema.parse(item)
      } catch {
        console.warn('Failed to parse media item:', item)
        return null
      }
    }).filter(Boolean) as InstagramMedia[]
  }

  // トップ投稿取得（いいね数上位）
  async getTopHashtagMedia(hashtagId: string): Promise<InstagramMedia[]> {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count,username'
    const url = `${this.baseUrl}/${hashtagId}/top_media?user_id=${this.businessAccountId}&fields=${fields}&access_token=${this.accessToken}`

    const res = await fetch(url)
    if (!res.ok) {
      const error = await res.json()
      throw new Error(`Top media fetch failed: ${error.error?.message || res.status}`)
    }

    const data = await res.json()

    return (data.data || []).map((item: unknown) => {
      try {
        return InstagramMediaSchema.parse(item)
      } catch {
        console.warn('Failed to parse media item:', item)
        return null
      }
    }).filter(Boolean) as InstagramMedia[]
  }
}
