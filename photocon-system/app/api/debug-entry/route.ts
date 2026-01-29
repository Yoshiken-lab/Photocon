import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
    try {
        const supabase = createAdminClient()
        console.log('Debug: Attempting insert...')

        const now = new Date().toISOString()
        const entryData = {
            contest_id: 'test-contest', // We might need a valid contest ID if there is FK constraint
            instagram_media_id: `debug-${Date.now()}`,
            instagram_permalink: 'https://example.com/debug.jpg',
            media_type: 'IMAGE',
            media_url: 'https://example.com/debug.jpg',
            username: 'debug_user',
            email: 'debug@example.com',
            caption: 'Debug Caption',
            status: 'pending',
            instagram_timestamp: now,
            collected_at: now,
            user_id: null, // explicit null
        }

        // Attempt insert
        const { data, error } = await supabase
            .from('entries')
            .insert(entryData as any)
            .select()

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                details: error,
                code: error.code,
                hint: error.hint
            }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })

    } catch (e: any) {
        return NextResponse.json({
            success: false,
            error: e.message,
            stack: e.stack
        }, { status: 500 })
    }
}
