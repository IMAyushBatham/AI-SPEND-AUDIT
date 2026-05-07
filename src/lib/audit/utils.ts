import type { Recommendation } from '@/types'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMonthlyCost(amount: number): string {
  return `${formatCurrency(amount)}/mo`
}

export function calcSavingsPercent(
  current: number,
  savings: number
): number {
  if (current === 0) return 0
  return Math.round((savings / current) * 100)
}

export function sortRecommendationsBySavings(
  recommendations: Recommendation[]
): Recommendation[] {
  return [...recommendations].sort(
    (a, b) => b.annualSavings - a.annualSavings
  )
}

export function getTopRecommendations(
  recommendations: Recommendation[],
  limit = 3
): Recommendation[] {
  return sortRecommendationsBySavings(recommendations).slice(0, limit)
}

export function getSavingsLevel(percent: number): {
  label: string
  color: string
} {
  if (percent >= 40) return { label: 'High Savings Potential', color: 'text-green-600' }
  if (percent >= 20) return { label: 'Moderate Savings Potential', color: 'text-yellow-600' }
  if (percent > 0) return { label: 'Low Savings Potential', color: 'text-orange-500' }
  return { label: 'Optimized Spend', color: 'text-blue-500' }
}

export function summarizeAudit(
  totalSpend: number,
  totalSavings: number,
  recommendationCount: number
): string {
  const percent = calcSavingsPercent(totalSpend, totalSavings)
  if (recommendationCount === 0) {
    return 'Your AI spend looks well-optimized. No major savings opportunities found.'
  }
  return `We found ${recommendationCount} optimization${recommendationCount > 1 ? 's' : ''} that could save you ${formatCurrency(totalSavings)}/month (${percent}% of current spend).`
}