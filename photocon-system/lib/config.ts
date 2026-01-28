export function isAuthEnabled(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true'
}
