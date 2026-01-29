export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contests: {
        Row: {
          id: string
          name: string
          description: string | null
          hashtags: string[]
          start_date: string
          end_date: string
          voting_start: string | null
          voting_end: string | null
          status: 'draft' | 'active' | 'voting' | 'ended'
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          hashtags: string[]
          start_date: string
          end_date: string
          voting_start?: string | null
          voting_end?: string | null
          status?: 'draft' | 'active' | 'voting' | 'ended'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          hashtags?: string[]
          start_date?: string
          end_date?: string
          voting_start?: string | null
          voting_end?: string | null
          status?: 'draft' | 'active' | 'voting' | 'ended'
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          contest_id: string
          name: string
          hashtag: string
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          contest_id: string
          name: string
          hashtag: string
          description?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          contest_id?: string
          name?: string
          hashtag?: string
          description?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      entries: {
        Row: {
          id: string
          contest_id: string
          category_id: string | null
          instagram_media_id: string
          instagram_permalink: string
          media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
          media_url: string
          thumbnail_url: string | null
          caption: string | null
          username: string
          email: string | null
          instagram_user_id: string | null
          like_count: number
          comments_count: number
          status: 'pending' | 'approved' | 'rejected' | 'winner'
          rejection_reason: string | null
          featured: boolean
          instagram_timestamp: string
          collected_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          contest_id: string
          category_id?: string | null
          instagram_media_id: string
          instagram_permalink: string
          media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
          media_url: string
          thumbnail_url?: string | null
          caption?: string | null
          username: string
          email?: string | null
          instagram_user_id?: string | null
          like_count?: number
          comments_count?: number
          status?: 'pending' | 'approved' | 'rejected' | 'winner'
          rejection_reason?: string | null
          featured?: boolean
          instagram_timestamp: string
          collected_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          contest_id?: string
          category_id?: string | null
          instagram_media_id?: string
          instagram_permalink?: string
          media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
          media_url?: string
          thumbnail_url?: string | null
          caption?: string | null
          username?: string
          email?: string | null
          instagram_user_id?: string | null
          like_count?: number
          comments_count?: number
          status?: 'pending' | 'approved' | 'rejected' | 'winner'
          rejection_reason?: string | null
          featured?: boolean
          instagram_timestamp?: string
          collected_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      votes: {
        Row: {
          id: string
          entry_id: string
          voter_identifier: string
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          voter_identifier: string
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          voter_identifier?: string
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          category: 'contest' | 'delete' | 'system' | 'other'
          name: string
          email: string
          message: string
          status: 'pending' | 'done'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: 'contest' | 'delete' | 'system' | 'other'
          name: string
          email: string
          message: string
          status?: 'pending' | 'done'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: 'contest' | 'delete' | 'system' | 'other'
          name?: string
          email?: string
          message?: string
          status?: 'pending' | 'done'
          created_at?: string
          updated_at?: string
        }
      }
      collection_logs: {
        Row: {
          id: string
          contest_id: string | null
          hashtag: string | null
          posts_found: number
          posts_added: number
          posts_updated: number
          error_message: string | null
          executed_at: string
        }
        Insert: {
          id?: string
          contest_id?: string | null
          hashtag?: string | null
          posts_found?: number
          posts_added?: number
          posts_updated?: number
          error_message?: string | null
          executed_at?: string
        }
        Update: {
          id?: string
          contest_id?: string | null
          hashtag?: string | null
          posts_found?: number
          posts_added?: number
          posts_updated?: number
          error_message?: string | null
          executed_at?: string
        }
      }
      account_deletion_requests: {
        Row: {
          id: string
          user_id: string
          user_email: string
          reason: string | null
          status: 'pending' | 'approved' | 'rejected'
          requested_at: string
          processed_at: string | null
          processed_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_email: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          processed_at?: string | null
          processed_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_email?: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          requested_at?: string
          processed_at?: string | null
          processed_by?: string | null
        }
      },
      system_settings: {
        Row: {
          key: string
          value: string
          description: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          description?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          description?: string | null
          updated_at?: string
        }
      }
    }
  }
}
