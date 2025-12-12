import { InstagramAPI } from './api'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CollectionResult } from './types'

export class PhotoContestCollector {
  private instagram: InstagramAPI
  private supabase: ReturnType<typeof createAdminClient>

  constructor() {
    this.instagram = new InstagramAPI()
    this.supabase = createAdminClient()
  }

  async collectForContest(contestId: string): Promise<CollectionResult> {
    const results: CollectionResult = {
      postsFound: 0,
      postsAdded: 0,
      postsUpdated: 0,
      errors: [],
    }

    if (!this.instagram.isConfigured()) {
      results.errors.push('Instagram API is not configured')
      return results
    }

    // コンテスト情報取得
    const { data: contest, error: contestError } = await this.supabase
      .from('contests')
      .select('*, categories(*)')
      .eq('id', contestId)
      .single()

    if (contestError || !contest) {
      results.errors.push('Contest not found')
      return results
    }

    // 各ハッシュタグを処理
    for (const hashtag of contest.hashtags || []) {
      try {
        const hashtagId = await this.instagram.getHashtagId(hashtag)
        const recentMedia = await this.instagram.getRecentHashtagMedia(hashtagId)

        results.postsFound += recentMedia.length

        // カテゴリ特定
        const category = (contest.categories || []).find(
          (c: { hashtag: string }) => hashtag.toLowerCase().includes(c.hashtag.toLowerCase())
        )

        for (const media of recentMedia) {
          // 期間内チェック
          const postDate = new Date(media.timestamp)
          const startDate = new Date(contest.start_date)
          const endDate = new Date(contest.end_date)

          if (postDate < startDate || postDate > endDate) {
            continue
          }

          // Upsert
          const { error } = await this.supabase
            .from('entries')
            .upsert(
              {
                contest_id: contestId,
                category_id: category?.id || null,
                instagram_media_id: media.id,
                instagram_permalink: media.permalink,
                media_type: media.media_type,
                media_url: media.media_url,
                thumbnail_url: media.thumbnail_url || null,
                caption: media.caption || null,
                username: media.username,
                like_count: media.like_count ?? 0,
                comments_count: media.comments_count ?? 0,
                instagram_timestamp: media.timestamp,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'instagram_media_id',
              }
            )

          if (error) {
            results.errors.push(`${media.id}: ${error.message}`)
          } else {
            results.postsAdded++
          }
        }
      } catch (err) {
        results.errors.push(`${hashtag}: ${(err as Error).message}`)
      }
    }

    // ログ記録
    await this.supabase.from('collection_logs').insert({
      contest_id: contestId,
      posts_found: results.postsFound,
      posts_added: results.postsAdded,
      posts_updated: results.postsUpdated,
      error_message: results.errors.length > 0 ? results.errors.join('\n') : null,
    })

    return results
  }

  // 全アクティブコンテストの収集
  async collectAll(): Promise<{ contestId: string; result: CollectionResult }[]> {
    const { data: contests } = await this.supabase
      .from('contests')
      .select('id')
      .eq('status', 'active')

    const results = []
    for (const contest of contests || []) {
      const result = await this.collectForContest(contest.id)
      results.push({ contestId: contest.id, result })
    }

    return results
  }
}
