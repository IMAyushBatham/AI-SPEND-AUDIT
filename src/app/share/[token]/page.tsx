import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SavingsHero from '@/components/results/SavingsHero'
import RecommendationCard from '@/components/results/RecommendationCard'
import { sortRecommendationsBySavings } from '@/lib/audit/utils'
import type { AuditResult } from '@/types'

async function getAudit(token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/audit/${token}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const data = await getAudit(token)
  if (!data) return { title: 'Audit Not Found' }

  const savings = data.potentialSavings ?? 0
  const title = `AI Spend Audit - Save $${savings}/month on AI tools`
  const description = `This startup could save $${savings}/month by optimizing their AI tool subscriptions.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await getAudit(token)
  if (!data) notFound()

  const result: AuditResult = data.results
  const sorted = sortRecommendationsBySavings(result.recommendations)

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Shared AI Spend Audit</h1>
        <p className="text-muted-foreground text-sm">
          Team size: {data.teamSize} · Use case: {data.useCase.replace('_', ' ')}
        </p>
      </div>

      <SavingsHero result={result} />

      {sorted.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommendations</h3>
          {sorted.map((rec, i) => (
  <RecommendationCard key={`${rec.toolId}-${i}`} recommendation={rec} index={i} />
))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-xl">
          No optimization opportunities found.
        </div>
      )}

      <div className="border rounded-xl p-6 text-center space-y-3 bg-muted/30">
        <p className="font-medium">Want to audit your own AI spend?</p>
        <p className="text-sm text-muted-foreground">
          It is free and takes less than 2 minutes.
        </p>
        <a href="/audit" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">Start Free Audit</a>
      </div>
    </section>
  )
}