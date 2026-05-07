import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingDown } from 'lucide-react'
import { formatCurrency, formatMonthlyCost } from '@/lib/audit/utils'
import type { Recommendation } from '@/types'

interface Props {
  recommendation: Recommendation
  index: number
}

export default function RecommendationCard({ recommendation: r, index }: Props) {
  const savingsPercent = r.currentMonthlyCost > 0
    ? Math.round((r.monthlySavings / r.currentMonthlyCost) * 100)
    : 0

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-lg" />
      <CardHeader className="pb-2 pl-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
            <CardTitle className="text-base">{r.toolName}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-green-600 bg-green-50 shrink-0">
            Save {formatCurrency(r.annualSavings)}/yr
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pl-6 space-y-4">
        {/* Plan comparison */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground mb-0.5">Current</p>
            <p className="font-medium">{r.currentPlan}</p>
            <p className="text-muted-foreground">{formatMonthlyCost(r.currentMonthlyCost)}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="flex-1 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
            <p className="text-xs text-green-600 mb-0.5">Recommended</p>
            <p className="font-medium text-green-700">{r.recommendedPlan}</p>
            <p className="text-green-600">{formatMonthlyCost(r.recommendedMonthlyCost)}</p>
          </div>
        </div>

        {/* Savings row */}
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingDown className="w-4 h-4" />
          <span>
            Save {formatMonthlyCost(r.monthlySavings)} ({savingsPercent}% reduction)
          </span>
        </div>

        {/* Reason */}
        <p className="text-sm text-muted-foreground leading-relaxed border-t pt-3">
          {r.reason}
        </p>
      </CardContent>
    </Card>
  )
}