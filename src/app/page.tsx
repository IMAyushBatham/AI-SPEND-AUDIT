import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
      <Badge variant="secondary">Free Audit Tool</Badge>
      <h1 className="text-5xl font-bold tracking-tight leading-tight max-w-3xl">
        Is your startup overpaying for AI tools?
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl">
        Enter your AI subscriptions and we'll find exactly where you're wasting
        money — and what to do about it.
      </p>
      <div className="flex gap-3 mt-2">
        <Link href="/audit">
          <Button size="lg">Start Free Audit</Button>
        </Link>
        <Link href="#how-it-works">
          <Button size="lg" variant="outline">
            How it works
          </Button>
        </Link>
      </div>
    </section>
  )
}