import { Badge } from '@/components/ui/badge'
import { formatCurrency, calcSavingsPercent, getSavingsLevel } from '@/lib/audit/utils'
import type { AuditResult } from '@/types'

interface Props {
  result: AuditResult
}

export default function SavingsHero({ result }: Props) {
  const {
    totalMonthlySpend,
    totalAnnualSpend,
    potentialMonthlySavings,
    potentialAnnualSavings,
    recommendations,
  } = result

  const percent = calcSavingsPercent(totalMonthlySpend, potentialMonthlySavings)
  const level = getSavingsLevel(percent)

  return (
    <div className="rounded-2xl border bg-card p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Audit Results</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Based on {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Badge className={`${level.color} bg-transparent border px-3 py-1 text-sm font-medium`}>
          {level.label}
        </Badge>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox
          label="Monthly Spend"
          value={formatCurrency(totalMonthlySpend)}
          sub="current"
        />
        <StatBox
          label="Annual Spend"
          value={formatCurrency(totalAnnualSpend)}
          sub="current"
        />
        <StatBox
          label="Monthly Savings"
          value={formatCurrency(potentialMonthlySavings)}
          sub="potential"
          highlight
        />
        <StatBox
          label="Annual Savings"
          value={formatCurrency(potentialAnnualSavings)}
          sub="potential"
          highlight
        />
      </div>

      {/* Savings bar */}
      {totalMonthlySpend > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Potential savings</span>
            <span>{percent}% of spend</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string
  value: string
  sub: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-xl p-4 space-y-1 ${highlight ? 'bg-green-50 border border-green-200' : 'bg-muted/50'}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${highlight ? 'text-green-600' : 'text-muted-foreground'}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold ${highlight ? 'text-green-700' : 'text-foreground'}`}>
        {value}
      </p>
      <p className={`text-xs ${highlight ? 'text-green-500' : 'text-muted-foreground'}`}>
        {sub}
      </p>
    </div>
  )
}