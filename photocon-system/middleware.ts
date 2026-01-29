import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isAuthEnabled } from '@/lib/config'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Admin Security (Always Active)
    // 管理画面へのアクセス制限。簡易的にセッションチェックを行う。
    // 本格的な運用では「特定メールアドレスのみ許可」などのロジックを追加推奨。
    if (pathname.startsWith('/admin')) {
        const supabase = createServerClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            // セッションがない場合はログイン画面（管理用がもしあれば、あるいは一般の）へ
            // 現状は一般ログインへ飛ばすが、本来はAdmin専用ログインが望ましい
            // ここでは取り急ぎルートへのリダイレクトとする（または404/403）
            // ※ユーザーのログイン画面と管理者のログイン画面が同じ場合は '/login' でOK
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

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
