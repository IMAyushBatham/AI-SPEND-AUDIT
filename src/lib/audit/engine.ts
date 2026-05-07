import type { AuditInput, AuditResult, Recommendation } from '@/types'
import {
  checkOverpricedPlan,
  checkExcessSeats,
  checkDuplicateCategory,
  checkAnnualDiscount,
  checkApiSpend,
} from './rules'

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
}

function deduplicateRecommendations(
  recommendations: Recommendation[]
): Recommendation[] {
  const seen = new Set<string>()
  return recommendations.filter((r) => {
    const key = `${r.toolId}-${r.recommendedPlan}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function runAudit(input: AuditInput): AuditResult {
  const { tools, teamSize } = input
  const allRecommendations: Recommendation[] = []

  for (const tool of tools) {
    const checks = [
      checkOverpricedPlan(tool, teamSize),
      checkExcessSeats(tool, teamSize),
      checkDuplicateCategory(tool, tools),
      checkAnnualDiscount(tool),
      checkApiSpend(tool),
    ]

    checks.forEach((r) => {
      if (r !== null) allRecommendations.push(r)
    })
  }

  const recommendations = deduplicateRecommendations(allRecommendations)

  const totalMonthlySpend = tools.reduce(
    (sum, tool) => sum + tool.costPerSeat * tool.seats,
    0
  )

  const potentialMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  )

  // Cap savings at total spend (can't save more than you spend)
  const cappedMonthlySavings = Math.min(potentialMonthlySavings, totalMonthlySpend)

  return {
    id: generateShareToken(),
    shareToken: generateShareToken(),
    totalMonthlySpend,
    totalAnnualSpend: totalMonthlySpend * 12,
    potentialMonthlySavings: cappedMonthlySavings,
    potentialAnnualSavings: cappedMonthlySavings * 12,
    recommendations,
    createdAt: new Date().toISOString(),
  }
}