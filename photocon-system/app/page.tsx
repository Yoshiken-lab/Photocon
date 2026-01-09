import Image from 'next/image'
import Link from 'next/link'
import { Camera, ImagePlus, Instagram, Heart, Gift, Menu } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { FloatingBanner } from '@/components/FloatingBanner'
import { EventsSection } from '@/components/EventsSection'
import { FAQSection } from '@/components/FAQSection'

interface Contest {
  id: string
  name: string
  description: string | null
  theme: string | null
  emoji: string | null
  image_url: string | null
  start_date: string
  end_date: string
  status: string
}

export default async function Home() {
  const supabase = createServerClient()

  // コンテストデータを取得
  const { data: contestsData } = await supabase
    .from('contests')
    .select('*')
    .in('status', ['active', 'upcoming', 'ended'])
    .order('start_date', { ascending: false })

  const contests = contestsData as Contest[] | null

  // ステータス別に分類
  const activeContests = contests?.filter(c => c.status === 'active') || []
  const upcomingContests = contests?.filter(c => c.status === 'upcoming') || []
  const endedContests = contests?.filter(c => c.status === 'ended') || []

  return (
    <>
      {/* トップバナー */}
      <div className="fixed top-0 w-full z-50 bg-brand text-white text-center py-2 text-xs md:text-sm font-bold">
        スクールフォト！会員様限定
      </div>

      <header className="fixed top-8 w-full z-40 bg-white/80 backdrop-blur-md border-b border-white/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="スクールフォト!"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm font-bold text-gray-500">
            <Link href="#top" className="hover:text-brand transition-colors py-2">トップ</Link>
            <Link href="#about" className="hover:text-brand transition-colors py-2">応募方法</Link>
            <Link href="#events" className="hover:text-brand transition-colors py-2">開催テーマ</Link>
            <Link href="/past-contests" className="hover:text-brand transition-colors py-2">過去テーマ</Link>
            <Link href="#faq" className="hover:text-brand transition-colors py-2">Q&A</Link>
            <Link href="#contact" className="hover:text-brand transition-colors py-2">お問い合わせ</Link>
          </nav>

          <button className="md:hidden p-2 text-gray-600 bg-white rounded-full shadow-sm">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-36 pb-16 md:pt-48 md:pb-24 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6 relative z-10 order-2 md:order-1 text-center md:text-left">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-brand text-lg md:text-xl font-bold rounded-full shadow-sm border border-brand-100">
                <span className="text-orange-400 text-2xl">★</span>
                <span>スマホにあるその1枚でOK</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-gray-800 font-maru">
                あの日の一瞬を、<br />
                <span className="text-brand inline-block relative">
                  未来の宝物
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
                に。
              </h1>

              <p className="text-gray-500 leading-relaxed max-w-md mx-auto md:mx-0 font-medium text-sm md:text-base">
                運動会のがんばった顔、お弁当をほおばる笑顔。<br />
                スマホの中に眠っているお子さまのベストショットを<br />
                みんなでシェアして楽しみませんか？
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                <Link href="/submit" className="w-full sm:w-auto px-8 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand/20 hover:-translate-y-1">
                  <Camera className="w-5 h-5" />
                  <span>写真を応募する</span>
                </Link>
                <Link href="/gallery" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-brand-100 hover:border-brand hover:text-brand text-gray-600 rounded-full font-bold transition-all flex items-center justify-center gap-2">
                  作品を見る
                </Link>
              </div>

              <p className="text-xs text-gray-400 pt-2">※ 登録は無料です。1分で完了します。</p>
            </div>

            <div className="relative order-1 md:order-2 px-4 md:px-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>

              <div className="relative aspect-[4/3] md:aspect-square bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand/10 border-[6px] border-white transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/top.png"
                  alt="公園で遊ぶ子ども"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                />

                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center text-center rotate-12">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Theme</span>
                  <span className="text-brand font-bold font-maru">「最高の笑顔」</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] scroll-mt-32">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-brand font-bold text-lg md:text-xl bg-brand-50 px-6 py-3 rounded-full mb-3 inline-block">かんたん 3ステップ</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800 font-maru mb-4">ママ・パパのための<br />やさしいコンテスト</h2>
              <p className="text-gray-500 text-sm">難しい操作はいりません。<br />いつものスマホ操作だけで参加できます。</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center text-brand mb-6 transition-transform group-hover:scale-110 rotate-3 group-hover:rotate-6">
                  <ImagePlus className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-maru">1. 写真を選ぶ</h3>
                <p className="text-gray-500 text-sm leading-7">スマホのアルバムから、<br />お気に入りの1枚を選びます。</p>
              </div>

              <div className="text-center group">
                <div className="relative w-20 h-20 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center text-brand mb-6 transition-transform group-hover:scale-110 -rotate-2 group-hover:-rotate-6">
                  <div className="absolute -right-2 -top-2 bg-yellow-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">!</div>
                  <Instagram className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-maru">2. アップロード</h3>
                <p className="text-gray-500 text-sm leading-7">そのままアップロードするか、<br />Instagramでタグ付け投稿でもOK。</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center text-brand mb-6 transition-transform group-hover:scale-110 rotate-3 group-hover:rotate-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-3 font-maru">3. みんなで応援</h3>
                <p className="text-gray-500 text-sm leading-7">素敵な作品にハートを送ろう。<br />入賞作品はサイトで表彰！</p>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <EventsSection
          activeContests={activeContests}
          upcomingContests={upcomingContests}
          endedContests={endedContests}
        />

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-xl border-4 border-brand-50">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#E84D1C 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-brand-100 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8" />
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 font-maru">
                自慢の一枚、待ってます
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
                入賞者には「スクールフォト！お値引きクーポン」など<br className="hidden md:block" />
                素敵なプレゼントをご用意しています。
              </p>
              <div className="pt-4">
                <Link href="/submit" className="inline-block px-12 py-4 bg-brand hover:bg-brand-600 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-brand/30 hover:-translate-y-1">
                  無料で参加する
                </Link>
              </div>
              <p className="text-xs text-gray-400 mt-4">募集期間：2025年12月31日まで</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* フローティングバナー */}
      <FloatingBanner />

      <footer className="bg-white text-gray-500 py-12 border-t border-brand-100 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="スクールフォト!"
              width={120}
              height={32}
              className="h-6 md:h-8 w-auto"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm">
            <Link href="#faq" className="hover:text-brand transition-colors">よくある質問</Link>
            <Link href="#" className="hover:text-brand transition-colors">利用規約</Link>
            <Link href="#" className="hover:text-brand transition-colors">プライバシーポリシー</Link>
            <Link href="#" className="hover:text-brand transition-colors">運営会社</Link>
          </div>

          <p className="text-xs text-gray-400">&copy; 2025 スクールフォト!</p>
        </div>
      </footer>
    </>
  )
}
