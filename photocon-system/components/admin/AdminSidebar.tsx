'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Link as LinkIcon, ChevronDown } from 'lucide-react'
import { LayoutDashboard, ClipboardCheck, Images, Trophy, Award, BarChart3, Settings, LogOut, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'ダッシュボード', group: 'main' },
  { href: '/admin/review', icon: ClipboardCheck, label: '審査待ち', group: 'manage', showBadge: true },
  { href: '/admin/entries', icon: Images, label: '応募一覧', group: 'manage' },
  {
    label: 'お問い合わせ',
    icon: Mail,
    group: 'manage',
    href: '#', // Parent, no link
    children: [
      { href: '/admin/inquiries', label: 'フォーム受信', showInquiryBadge: true },
      { href: '/admin/account-deletions', label: '退会申請', showDeletionBadge: true, className: 'text-red-500' }
    ]
  },
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
  const [deletionCount, setDeletionCount] = useState(0)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('お問い合わせ') // Default open for visibility
  const supabase = createClient()

  useEffect(() => {
    // 初回取得
    const fetchCount = async () => {
      // Inquiries
      const { count: iCount } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      setInquiryCount(iCount || 0)

      // Deletions
      const { count: dCount } = await supabase
        .from('account_deletion_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      setDeletionCount(dCount || 0)
    }

    fetchCount()

    // リアルタイム購読
    const channelInquiries = supabase
      .channel('inquiries-sidebar-badge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, () => fetchCount())
      .subscribe()

    const channelDeletions = supabase
      .channel('deletions-sidebar-badge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'account_deletion_requests' }, () => fetchCount())
      .subscribe()

    return () => {
      supabase.removeChannel(channelInquiries)
      supabase.removeChannel(channelDeletions)
    }
  }, [])

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(prev => prev === label ? null : label)
  }

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
              // Submenu logic
              if ('children' in item && item.children) {
                const isOpen = openSubmenu === item.label
                const totalChildrenBadge = item.children.reduce((acc, child) => {
                  if ('showInquiryBadge' in child && child.showInquiryBadge) return acc + inquiryCount
                  if ('showDeletionBadge' in child && child.showDeletionBadge) return acc + deletionCount
                  return acc
                }, 0)

                return (
                  <li key={item.label}>
                    <div className={`overflow-hidden rounded-xl transition-all ${isOpen ? 'bg-gray-50' : ''}`}>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isOpen ? 'text-gray-800 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <ul className="pb-2 space-y-1">
                          {item.children.map(child => {
                            const isChildActive = pathname === child.href
                            const childCount = ('showInquiryBadge' in child && child.showInquiryBadge) ? inquiryCount
                              : ('showDeletionBadge' in child && child.showDeletionBadge) ? deletionCount
                                : 0

                            // Icon type safety
                            const IconComponent = 'icon' in child ? (child.icon as any) : null

                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`flex items-center gap-2 pl-12 pr-4 py-2 text-sm transition-colors ${isChildActive ? 'text-brand font-bold bg-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                                    } ${child.className || ''}`}
                                >
                                  {IconComponent ? <IconComponent className="w-4 h-4" /> : null}
                                  <span className="flex-1">{child.label}</span>
                                  {childCount > 0 && (
                                    <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${'showDeletionBadge' in child ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'
                                      }`}>
                                      {childCount}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </li>
                )
              }

              // Normal Item Logic
              const isActive = pathname === item.href
              // 'showBadge' exists -> Entries Pending Count
              const showBadge = ('showBadge' in item && item.showBadge && pendingCount > 0)

              // 表示するカウント
              const countDisplay = pendingCount

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
