import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isAuthEnabled as isAuthEnabledEnv } from '@/lib/config'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // NOTE: /admin は認証不要（URLを知っている人だけがアクセスできる運用）
    // 将来的に認証を追加したい場合は、ここにセッションチェックを実装

    // 2. Feature Flagged Routes (Login, MyPage)
    // DB設定から「ログイン必須モード」の状態を取得
    // NOTE: Middlewareでは next/headers の cookies() が使えないため、
    // createSystemSetting などのサーバーアクションではなく、直接Supabaseクライアントで取得する
    let isAuthEnabled = false // Default to false (Anonymous mode) if fetch fails or key missing

    // Create a temporary client for public data fetch (system_settings is public read)
    // We already have 'supabase' from createClient(request) if we were using it for admin...
    // But admin check uses createServerClient() locally.
    // Let's use a fresh client for this check to be safe and independent.
    // Actually, we can reuse the strategy from Admin check: createServerClient()
    const supabase = createServerClient()

    try {
        const { data } = await supabase
            .from('system_settings')
            .select('value')
            .eq('key', 'is_auth_enabled')
            .single()

        if (data?.value === 'true') {
            isAuthEnabled = true
        }
    } catch (e) {
        console.error('Middleware Config Fetch Error:', e)
        // Fallback to Env var if DB fails? Or default to false?
        // Let's fallback to Env for safety during migration
        if (isAuthEnabledEnv()) {
            isAuthEnabled = true
        }
    }

    if (isAuthEnabled) {
        const protectedRoutes = ['/submit', '/mypage', '/sample-o/apply']
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

        if (isProtectedRoute) {
            const supabase = createServerClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                // 未ログインならログイン画面へ飛ばす！
                const redirectUrl = new URL('/login', request.url)
                redirectUrl.searchParams.set('next', pathname) // ログイン後の戻り先
                return NextResponse.redirect(redirectUrl)
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
