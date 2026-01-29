-- =============================================================================
-- 熱血マイグレーション: アカウント削除申請機能
-- 作成日: 2026-01-29
-- =============================================================================

-- 1. アカウント削除申請テーブルの作成
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending（申請中）, approved（承認済み）, rejected（却下）
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID
);

-- インデックス（ステータス別の検索を高速化）
CREATE INDEX IF NOT EXISTS idx_account_deletion_requests_status 
  ON account_deletion_requests(status);

-- インデックス（ユーザー別の検索を高速化）
CREATE INDEX IF NOT EXISTS idx_account_deletion_requests_user_id 
  ON account_deletion_requests(user_id);

-- 2. RLSポリシーの設定
-- -----------------------------------------------------------------------------
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の申請のみ閲覧可能
CREATE POLICY "Users can view own deletion requests"
  ON account_deletion_requests FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分の申請のみ作成可能
CREATE POLICY "Users can insert own deletion requests"
  ON account_deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. entries.user_id の外部キー制約を ON DELETE SET NULL に変更
-- -----------------------------------------------------------------------------
-- 注意: 既存の制約名が異なる場合は適宜修正してください
-- まず既存の制約を削除（存在しない場合はエラーになるので、手動で確認推奨）
-- ALTER TABLE entries DROP CONSTRAINT IF EXISTS entries_user_id_fkey;

-- 新しい制約を追加（ON DELETE SET NULL）
-- ALTER TABLE entries 
--   ADD CONSTRAINT entries_user_id_fkey 
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- =============================================================================
-- 実行手順:
-- 1. Supabase Dashboard > SQL Editor でこのファイルの内容を実行
-- 2. 外部キー制約の変更（コメントアウト部分）は、既存の制約を確認してから実行
-- =============================================================================
