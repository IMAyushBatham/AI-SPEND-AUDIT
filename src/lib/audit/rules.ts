import { PRICING } from './pricing'
import type { ToolEntry, Recommendation } from '@/types'

function monthlyTotal(tool: ToolEntry): number {
  return tool.costPerSeat * tool.seats
}

function findCheaperPlan(tool: ToolEntry, teamSize: number) {
  const pricing = PRICING[tool.name]
  if (!pricing) return null

  const currentPlan = pricing.plans.find(
    (p) => p.label.toLowerCase() === tool.plan.toLowerCase()
  )
  if (!currentPlan) return null

  const betterPlan = pricing.plans.find(
    (p) =>
      p.pricePerSeat < currentPlan.pricePerSeat &&
      (!p.minSeats || p.minSeats <= teamSize)
  )

  if (!betterPlan) return null

  return {
    plan: betterPlan,
    monthlyCost: betterPlan.pricePerSeat * tool.seats,
  }
}

export interface UseCaseGroup {
  useCase: string
  tools: ToolEntry[]
}

export function analyzeUseCaseGroup(
  group: UseCaseGroup,
  teamSize: number
): Recommendation | null {
  const { useCase, tools } = group

  if (tools.length === 0) return null

  const totalCurrentCost = tools.reduce((s, t) => s + monthlyTotal(t), 0)
  const toolNames = tools.map((t) => PRICING[t.name]?.name ?? t.name)

  // Case 1: Multiple tools in same use case — consolidation
  if (tools.length > 1) {
    // Find the best single tool to keep (lowest cost that covers the use case)
    const sorted = [...tools].sort(
      (a, b) => monthlyTotal(a) - monthlyTotal(b)
    )
    const keepTool = sorted[0]
    const removedTools = sorted.slice(1)
    const removedCost = removedTools.reduce((s, t) => s + monthlyTotal(t), 0)

    // Check if keeping tool can be optimized too
    const cheaper = findCheaperPlan(keepTool, teamSize)
    const keepCost = cheaper
      ? cheaper.monthlyCost
      : monthlyTotal(keepTool)

    const recommendedCost = keepCost
    const monthlySavings = totalCurrentCost - recommendedCost

    if (monthlySavings <= 0) return null

    const keepPricing = PRICING[keepTool.name]
    const recommendedPlan = cheaper
      ? `${keepPricing?.name ?? keepTool.name} ${cheaper.plan.label}`
      : `${keepPricing?.name ?? keepTool.name} ${keepTool.plan} only`

    return {
      toolId: `usecase-${useCase}`,
      toolName: toolNames.join(' + '),
      currentPlan: tools.map((t) => `${PRICING[t.name]?.name ?? t.name} ${t.plan}`).join(', '),
      currentMonthlyCost: totalCurrentCost,
      recommendedPlan,
      recommendedMonthlyCost: recommendedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `Both ${toolNames.join(' and ')} serve overlapping ${useCase.replace('_', ' ')} functionality. Consolidating into ${keepPricing?.name ?? keepTool.name} eliminates $${removedCost}/month of redundant spend with minimal loss in capability.`,
    }
  }

  // Case 2: Single tool — find best optimization
  const tool = tools[0]
  const currentCost = monthlyTotal(tool)
  const pricing = PRICING[tool.name]

  if (!pricing) return null

  // Check overpriced plan
  const cheaper = findCheaperPlan(tool, teamSize)
  if (cheaper) {
    const monthlySavings = currentCost - cheaper.monthlyCost
    if (monthlySavings > 0) {
      return {
        toolId: `usecase-${useCase}`,
        toolName: pricing.name,
        currentPlan: tool.plan,
        currentMonthlyCost: currentCost,
        recommendedPlan: cheaper.plan.label,
        recommendedMonthlyCost: cheaper.monthlyCost,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        reason: `Your team of ${teamSize} is on ${tool.plan} but ${cheaper.plan.label} covers all essential ${useCase.replace('_', ' ')} features at a lower cost.`,
      }
    }
  }

  // Check excess seats
  if (tool.seats > teamSize * 1.1) {
    const currentPlan = pricing.plans.find(
      (p) => p.label.toLowerCase() === tool.plan.toLowerCase()
    )
    if (currentPlan) {
      const recommendedCost = currentPlan.pricePerSeat * teamSize
      const monthlySavings = currentCost - recommendedCost
      if (monthlySavings > 0) {
        return {
          toolId: `usecase-${useCase}`,
          toolName: pricing.name,
          currentPlan: `${tool.plan} (${tool.seats} seats)`,
          currentMonthlyCost: currentCost,
          recommendedPlan: `${tool.plan} (${teamSize} seats)`,
          recommendedMonthlyCost: recommendedCost,
          monthlySavings,
          annualSavings: monthlySavings * 12,
          reason: `You have ${tool.seats} seats but only ${teamSize} team members. Reducing to ${teamSize} seats saves $${monthlySavings}/month immediately.`,
        }
      }
    }
  }

  // Check annual billing
  if (tool.billingCycle === 'monthly' && currentCost >= 50) {
    const annualCost = currentCost * 0.83
    const monthlySavings = currentCost - annualCost
    return {
      toolId: `usecase-${useCase}`,
      toolName: pricing.name,
      currentPlan: `${tool.plan} (Monthly)`,
      currentMonthlyCost: currentCost,
      recommendedPlan: `${tool.plan} (Annual)`,
      recommendedMonthlyCost: annualCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `Switching ${pricing.name} to annual billing saves ~17% — $${monthlySavings.toFixed(0)}/month or $${(monthlySavings * 12).toFixed(0)}/year with no change in features.`,
    }
  }

  return null
}