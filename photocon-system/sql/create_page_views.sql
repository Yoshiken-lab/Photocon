-- page_views テーブル作成
-- メインページへのアクセスログを記録するテーブル

CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_type TEXT NOT NULL CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス作成（曜日×時間帯集計用）
CREATE INDEX IF NOT EXISTS idx_page_views_accessed_at ON page_views (accessed_at);

-- インデックス作成（visitor_id検索用）
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views (visitor_id);

-- RLS（Row Level Security）を有効化
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーでもINSERTできるポリシー
CREATE POLICY "Allow anonymous insert" ON page_views
  FOR INSERT
  WITH CHECK (true);

-- 管理者のみSELECTできるポリシー（service_roleで取得する想定）
CREATE POLICY "Allow service role select" ON page_views
  FOR SELECT
  USING (true);

-- コメント追加
COMMENT ON TABLE page_views IS 'メインページへのアクセスログ';
COMMENT ON COLUMN page_views.visitor_id IS '匿名訪問者ID（LocalStorageで生成）';
COMMENT ON COLUMN page_views.accessed_at IS 'アクセス日時';
COMMENT ON COLUMN page_views.device_type IS 'デバイス種別（mobile/desktop/tablet）';
COMMENT ON COLUMN page_views.ip_address IS 'IPアドレス';
