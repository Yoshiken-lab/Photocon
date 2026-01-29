import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isAuthEnabled } from '@/lib/config'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // NOTE: /admin は認証不要（URLを知っている人だけがアクセスできる運用）
    // 将来的に認証を追加したい場合は、ここにセッションチェックを実装

    // 2. Feature Flagged Routes (Login, MyPage)
    // 熱血ログイン機能がONの場合のみチェック
    if (isAuthEnabled()) {
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
