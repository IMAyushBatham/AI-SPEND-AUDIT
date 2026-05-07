'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import type { AuditInput, AuditResult } from '@/types'

interface Props {
  input: AuditInput
  result: AuditResult
}

export default function SummaryCard({ input, result }: Props) {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, result }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setSummary(data.summary)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <CardTitle className="text-base">AI Summary</CardTitle>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-4/6" />
          </div>
        )}
        {!loading && error && (
          <p className="text-sm text-muted-foreground">
            Unable to generate AI summary. Please review the recommendations below.
          </p>
        )}
        {!loading && !error && (
          <p className="text-sm leading-relaxed text-foreground/80">{summary}</p>
        )}
      </CardContent>
    </Card>
  )
}