-- 🔥 Realtime有効化のためのSQL 🔥
-- これを実行しないとリアルタイム更新は動かねえぞ！！！！

-- inquiriesテーブルをRealtimeの監視対象に追加する
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;

-- 念のため、既存のテーブル設定を確認したい場合は以下（これは実行しなくてもいい）
-- select * from pg_publication_tables where pubname = 'supabase_realtime';
