import { getSystemSetting } from '@/lib/system-settings'
import AuthModeToggle from '@/components/admin/AuthModeToggle'

export default async function AdminSettingsPage() {
  // サーバーサイドで現在の設定値を取得
  const isAuthEnabledStr = await getSystemSetting('is_auth_enabled', 'false')
  const isAuthEnabled = isAuthEnabledStr === 'true'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">設定</h1>
        <p className="text-gray-500 mt-1">システム設定・Instagram連携</p>
      </div>

      <div className="grid gap-6">
        {/* 認証設定 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-800">認証設定</h2>
          </div>

          <AuthModeToggle initialIsEnabled={isAuthEnabled} />

          <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-100 flex gap-3 items-start">
            <span className="text-xl">⚠️</span>
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-1">【注意】設定変更の影響について</p>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>「匿名モード」にすると、誰でもログインなしで応募投稿が可能になります。</li>
                <li>「ログイン必須モード」にすると、応募時にアカウント登録・ログインが必須になります。</li>
                <li>設定変更は即座にシステム全体に反映されます。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instagram連携 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Instagram連携</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                アクセストークン
              </label>
              <input
                type="password"
                placeholder="Instagram Access Token"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">環境変数で設定されています</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ビジネスアカウントID
              </label>
              <input
                type="text"
                placeholder="Business Account ID"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">環境変数で設定されています</p>
            </div>
          </div>
        </div>

        {/* 収集設定 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">収集設定</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">自動収集</p>
                <p className="text-sm text-gray-500">1時間ごとにInstagramから投稿を収集</p>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">自動承認</p>
                <p className="text-sm text-gray-500">収集した投稿を自動的に承認</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 手動収集 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">手動操作</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-600 transition-colors">
              今すぐ収集を実行
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              キャッシュをクリア
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
