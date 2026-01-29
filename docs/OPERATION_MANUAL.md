# 📖 運用マニュアル (OPERATION MANUAL)

ここには、コード（Git）で管理できない「外部サービスの定数設定」や「運用手順」を記録する。
設定を変更した場合は、必ずここも更新すること！！！！

---

## 1. Supabase 設定

### 📧 メールテンプレート (Email Templates)
Supabase Dashboard > Authentication > Emails > Templates

#### 新規登録確認メール (Confirm Signup)
**利用中テンプレート (2026-01-29 更新)**

- **Subject**: `【スクールフォト！フォトコンテスト】アカウント登録のご案内`
- **Sender Name**: `スクールフォト！フォトコンテスト事業部`
- **Body**:
```html
<p>この度はスクールフォト！フォトコンテストへご登録いただき、誠にありがとうございます。</p>
<p>以下のボタンをクリックして、会員登録を完了してください。</p>
<p style="margin: 20px 0;">
  <a href="{{ .ConfirmationURL }}" style="background-color: #E84D1C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">登録を完了する</a>
</p>
<p>※このメールにお心当たりがない場合は、お手数ですがそのまま破棄してください。</p>
<hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
<p style="font-size: 12px; color: #888;">
  スクールフォト！フォトコンテスト事業部<br>
  ※本メールは送信専用です。ご返信いただいてもお答えできませんのでご了承ください。
</p>
```

---
