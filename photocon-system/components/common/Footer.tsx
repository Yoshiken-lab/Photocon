import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
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
          <Link href="#" className="hover:text-brand transition-colors">
            よくある質問
          </Link>
          <Link href="#" className="hover:text-brand transition-colors">
            利用規約
          </Link>
          <Link href="#" className="hover:text-brand transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="#" className="hover:text-brand transition-colors">
            運営会社
          </Link>
        </div>

        <p className="text-xs text-gray-400">&copy; 2025 スクールフォト!</p>
      </div>
    </footer>
  )
}
