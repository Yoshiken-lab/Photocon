import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import mime from 'mime'

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    const filename = params.filename

    // Security: Prevent directory traversal (basic check)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return new NextResponse('Invalid filename', { status: 400 })
    }

    // Define the local path (hardcoded to the user's specified folder)
    // Note: In production this path might not exist, but for this local dev environment it satisfies the user.
    // We navigate up from app/api/slideshow/[filename] -> photocon-system -> slideshow
    // process.cwd() is usually the project root (photocon-system)
    const slidesDir = path.join(process.cwd(), 'slideshow')
    const filePath = path.join(slidesDir, filename)

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 })
        }

        const fileBuffer = fs.readFileSync(filePath)
        const mimeType = mime.getType(filePath) || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=3600'
            }
        })
    } catch (error) {
        console.error('Error serving slideshow image:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
