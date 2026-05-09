'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SavingsHero from '@/components/results/SavingsHero'
import RecommendationCard from '@/components/results/RecommendationCard'
import SummaryCard from '@/components/results/SummaryCard'
import LeadCaptureForm from '@/components/results/LeadCaptureForm'
import { Button } from '@/components/ui/button'
import { sortRecommendationsBySavings } from '@/lib/audit/utils'
import type { AuditInput, AuditResult } from '@/types'

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [input, setInput] = useState<AuditInput | null>(null)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [showLead, setShowLead] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async (url: string) => {
    const full = `${window.location.origin}${url}`
    await navigator.clipboard.writeText(full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareSuccess = (url: string) => {
    setShareUrl(url)
    setShowLead(false)
    handleCopy(url)
  }

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
  <RecommendationCard key={`${i}-${rec.recommendedPlan}`} recommendation={rec} index={i} />
))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border rounded-xl">
          No optimization opportunities found. Your spend looks well-optimized!
        </div>
      )}

      <div className="flex gap-3 pt-4 flex-wrap">
        <Button variant="outline" onClick={() => router.push('/audit')}>
          ← Edit Audit
        </Button>

        {shareUrl ? (
          <Button onClick={() => handleCopy(shareUrl)}>
            {copied ? 'Copied!' : 'Copy Share Link'}
          </Button>
        ) : (
          <Button onClick={() => setShowLead(true)}>
            Share Audit →
          </Button>
        )}
      </div>

      <LeadCaptureForm
        input={input}
        result={result}
        open={showLead}
        onClose={() => setShowLead(false)}
        onSuccess={handleShareSuccess}
      />
    </section>
  )
}