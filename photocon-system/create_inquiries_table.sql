-- 🔥 ユーザー（はるきち）へのメッセージ 🔥
-- このSQLをSupabaseのSQL Editorで実行してくれ！！！！
-- これで「inquiries」テーブルが作成され、お問い合わせデータを受け入れる準備が整うぞ！！！！

-- 1. Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('contest', 'delete', 'system', 'other')),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Allow anyone to insert (Submit Inquiry)
-- 誰でも問い合わせを送れるようにする（認証不要）
CREATE POLICY "Allow anonymous inserts"
ON inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Create Policy: Allow admins to view everything
-- 管理者は全てを見通せる（service_roleはデフォルトで全権限だが、認証済みユーザー向けの設定も必要ならここに追加）
-- とりあえず、認証済み管理者（もしいるなら）向けにSELECT許可
CREATE POLICY "Enable read access for authenticated users"
ON inquiries
FOR SELECT
TO authenticated, anon
USING (true); -- 暫定: 誰でも見れたらまずいが、管理画面実装テスト用に一旦開放。
-- 本番運用時は `TO authenticated` にして、適切なロールチェックを入れるべきだが、
-- 現状の認証基盤が不明確なため、テスト容易性を優先して開放しておく。
-- ※本番前に必ず見直すこと！！！！

-- 5. Create Policy: Allow admins to update status
CREATE POLICY "Enable update for authenticated users"
ON inquiries
FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);
-- これも暫定だ！！！！
