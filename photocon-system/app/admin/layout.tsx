import { AdminSidebar } from '@/components/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createAdminClient()

  // 審査待ち件数を取得
  const { count: pendingCount } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar pendingCount={pendingCount || 0} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
