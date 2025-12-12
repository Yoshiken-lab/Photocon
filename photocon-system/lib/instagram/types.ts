import { z } from 'zod'

export const InstagramMediaSchema = z.object({
  id: z.string(),
  media_type: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']),
  media_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  permalink: z.string().url(),
  caption: z.string().optional().nullable(),
  timestamp: z.string(),
  like_count: z.number().optional(),
  comments_count: z.number().optional(),
  username: z.string(),
})

export type InstagramMedia = z.infer<typeof InstagramMediaSchema>

export interface HashtagSearchResult {
  id: string
}

export interface CollectionResult {
  postsFound: number
  postsAdded: number
  postsUpdated: number
  errors: string[]
}
