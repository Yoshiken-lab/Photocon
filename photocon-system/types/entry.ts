import type { Database } from './database'

export type Entry = Database['public']['Tables']['entries']['Row'] & {
  categories?: {
    name: string
  } | null
}

// ユーザー画面用（emailを含まない）
export type PublicEntry = {
  id: string
  media_url: string
  username: string
  like_count: number | null
  caption: string | null
  instagram_permalink: string
  instagram_timestamp: string
  categories?: {
    name: string
  } | null
}

export type Contest = Database['public']['Tables']['contests']['Row'] & {
  categories?: Category[]
}

export type Category = Database['public']['Tables']['categories']['Row']

export type Vote = Database['public']['Tables']['votes']['Row']

export type CollectionLog = Database['public']['Tables']['collection_logs']['Row']
