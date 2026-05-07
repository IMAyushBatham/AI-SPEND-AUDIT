'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SavingsHero from '@/components/results/SavingsHero'
import RecommendationCard from '@/components/results/RecommendationCard'
import SummaryCard from '@/components/results/SummaryCard'
import { Button } from '@/components/ui/button'
import { sortRecommendationsBySavings } from '@/lib/audit/utils'
import type { AuditInput, AuditResult } from '@/types'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [input, setInput] = useState<AuditInput | null>(null)
  const [result, setResult] = useState<AuditResult | null>(null)

  useEffect(() => {
    try {
      const savedInput = localStorage.getItem('ai-spend-audit-form')
      const savedResult = localStorage.getItem('ai-spend-audit-result')
      if (!savedInput || !savedResult) {
        router.push('/audit')
        return
      }
      const parsedResult: AuditResult = JSON.parse(savedResult)
      if (parsedResult.id !== params.id) {
        router.push('/audit')
        return
      }
      setInput(JSON.parse(savedInput))
      setResult(parsedResult)
    } catch {
      router.push('/audit')
    }
  }, [])

  if (!input || !result) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-40 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </section>
    )
  }

  const sorted = sortRecommendationsBySavings(result.recommendations)

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <SavingsHero result={result} />
      <SummaryCard input={input} result={result} />

      {sorted.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommendations</h3>
          {sorted.map((rec, i) => (
            <RecommendationCard key={rec.toolId} recommendation={rec} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-xl">
          No optimization opportunities found. Your spend looks well-optimized!
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={() => router.push('/audit')}>
          ← Edit Audit
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
          }}
        >
          Copy Share Link
        </Button>
      </div>
    </section>
  )
}