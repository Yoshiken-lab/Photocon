import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import { isAuthEnabled } from '@/lib/config'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Create Supabase client designed for Middleware
    // This returns the supabase instance AND a response object that handles cookie updates (refreshing sessions)
    const { supabase, response } = await createClient(request)

    // 1. Admin Security (Always Active)

    if (pathname.startsWith('/admin')) {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            // セッションがない場合はログイン画面へ
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 2. Feature Flagged Routes (Login, MyPage)
    // 熱血ログイン機能がONの場合のみチェック
    if (isAuthEnabled()) {
        const protectedRoutes = ['/submit', '/mypage', '/sample-o/apply']
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

        if (isProtectedRoute) {
            // Note: Reuse the same supabase instance to minimize overhead
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                // 未ログインならログイン画面へ飛ばす！
                const redirectUrl = new URL('/login', request.url)
                redirectUrl.searchParams.set('next', pathname) // ログイン後の戻り先
                return NextResponse.redirect(redirectUrl)
            }
        }
    }

    // Return the response created by createClient to ensure cookies (session refresh) are applied
    return response
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
