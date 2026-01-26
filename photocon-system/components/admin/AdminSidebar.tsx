'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardCheck, Images, Trophy, Award, BarChart3, Settings, LogOut, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'ダッシュボード', group: 'main' },
  { href: '/admin/review', icon: ClipboardCheck, label: '審査待ち', group: 'manage', showBadge: true },
  { href: '/admin/entries', icon: Images, label: '応募一覧', group: 'manage' },
  { href: '/admin/inquiries', icon: Mail, label: 'お問い合わせ', group: 'manage', showInquiryBadge: true },
  { href: '/admin/ranking', icon: Award, label: 'ランキング', group: 'manage' },
  { href: '/admin/contests', icon: Trophy, label: 'コンテスト管理', group: 'settings' },
  { href: '/admin/reports', icon: BarChart3, label: 'レポート', group: 'settings' },
  { href: '/admin/settings', icon: Settings, label: '設定', group: 'settings' },
]

interface AdminSidebarProps {
  pendingCount: number
}

export function AdminSidebar({ pendingCount }: AdminSidebarProps) {
  const pathname = usePathname()
  const [inquiryCount, setInquiryCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    // 初回取得
    const fetchCount = async () => {
      const { count } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setInquiryCount(count || 0)
    }

    fetchCount()

    // リアルタイム購読
    const channel = supabase
      .channel('inquiries-sidebar-badge')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inquiries',
        },
        () => {
          // 何か変更があったらカウントを再取得 (INSERT/UPDATE/DELETEすべて)
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <Link href="/">
          <Image
            src="/logo-bak.png"
            alt="スクールフォト!"
            width={140}
            height={35}
            className="h-8 w-auto"
          />
        </Link>
        <p className="text-xs text-gray-400 mt-2">管理画面</p>
      </div>

      <nav className="flex-1 p-4">
        {/* メイングループ */}
        <ul className="space-y-1">
          {menuItems.filter(item => item.group === 'main').map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-brand text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* 運用グループ */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">運用</p>
          <ul className="space-y-1">
            {menuItems.filter(item => item.group === 'manage').map((item) => {
              const isActive = pathname === item.href
              // 'showBadge' exists -> Entries Pending Count
              // 'showInquiryBadge' exists -> Inquiries Pending Count
              const showBadge = ('showBadge' in item && item.showBadge && pendingCount > 0) || ('showInquiryBadge' in item && item.showInquiryBadge && inquiryCount > 0)

              // 表示するカウント
              const countDisplay = 'showInquiryBadge' in item ? inquiryCount : pendingCount

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? 'bg-brand text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {showBadge && (
                      <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${isActive ? 'bg-white text-brand' : 'bg-red-500 text-white'
                        }`}>
                        {countDisplay > 99 ? '99+' : countDisplay}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 設定グループ */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">管理</p>
          <ul className="space-y-1">
            {menuItems.filter(item => item.group === 'settings').map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? 'bg-brand text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          サイトに戻る
        </Link>
      </div>
    </aside>
  )
}
