import type { AuditInput, AuditResult } from '@/types'
import { analyzeUseCaseGroup } from './rules'

function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10)
}

export function runAudit(input: AuditInput): AuditResult {
  const { tools, teamSize } = input

  // Group tools by useCase
  const useCaseMap = new Map<string, typeof tools>()
  for (const tool of tools) {
    const key = tool.useCase
    if (!useCaseMap.has(key)) useCaseMap.set(key, [])
    useCaseMap.get(key)!.push(tool)
  }

  // Generate one recommendation per use case
  const recommendations = Array.from(useCaseMap.entries())
    .map(([useCase, groupTools]) =>
      analyzeUseCaseGroup({ useCase, tools: groupTools }, teamSize)
    )
    .filter((r): r is NonNullable<typeof r> => r !== null)

  const totalMonthlySpend = tools.reduce(
    (sum, tool) => sum + tool.costPerSeat * tool.seats, 0
  )

  const potentialMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings, 0
  )

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