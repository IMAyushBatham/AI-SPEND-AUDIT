import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          AI Spend Audit
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/audit">
            <Button size="sm">Start Free Audit</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}