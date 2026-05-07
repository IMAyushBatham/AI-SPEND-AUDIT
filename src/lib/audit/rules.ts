import { PRICING } from './pricing'
import type { ToolEntry, Recommendation } from '@/types'

function monthlyTotal(tool: ToolEntry): number {
  const cost = tool.costPerSeat * tool.seats
  return tool.billingCycle === 'annual' ? cost : cost
}

function makeRecommendation(
  tool: ToolEntry,
  recommendedPlan: string,
  recommendedCost: number,
  reason: string
): Recommendation | null {
  const currentMonthly = monthlyTotal(tool)
  const monthlySavings = currentMonthly - recommendedCost
  if (monthlySavings <= 0) return null

  return {
    toolId: tool.id,
    toolName: tool.name,
    currentPlan: tool.plan,
    currentMonthlyCost: currentMonthly,
    recommendedPlan,
    recommendedMonthlyCost: recommendedCost,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    reason,
  }
}

// Rule 1: Small team on Business/Enterprise plan
export function checkOverpricedPlan(
  tool: ToolEntry,
  teamSize: number
): Recommendation | null {
  const pricing = PRICING[tool.name]
  if (!pricing) return null

  const currentPlan = pricing.plans.find(
    (p) => p.label.toLowerCase() === tool.plan.toLowerCase()
  )
  if (!currentPlan) return null

  // If on business/enterprise and small team
  const isExpensivePlan =
    currentPlan.id === 'business' || currentPlan.id === 'enterprise'
  const isSmallTeam = teamSize <= 10

  if (isExpensivePlan && isSmallTeam) {
    // Find the pro/plus plan
    const betterPlan = pricing.plans.find(
      (p) => p.id === 'pro' || p.id === 'plus' || p.id === 'individual'
    )
    if (!betterPlan) return null

    const recommendedCost = betterPlan.pricePerSeat * tool.seats
    return makeRecommendation(
      tool,
      betterPlan.label,
      recommendedCost,
      `Your team of ${teamSize} doesn't need an enterprise plan. ${betterPlan.label} covers all essential features at a lower cost.`
    )
  }

  return null
}

// Rule 2: Too many seats vs team size
export function checkExcessSeats(
  tool: ToolEntry,
  teamSize: number
): Recommendation | null {
  const pricing = PRICING[tool.name]
  if (!pricing) return null

  const excessRatio = tool.seats / teamSize
  if (excessRatio <= 1.2) return null // within 20% is fine

  const optimalSeats = teamSize
  const currentPlan = pricing.plans.find(
    (p) => p.label.toLowerCase() === tool.plan.toLowerCase()
  )
  if (!currentPlan) return null

  const recommendedCost = currentPlan.pricePerSeat * optimalSeats
  const currentCost = monthlyTotal(tool)
  if (recommendedCost >= currentCost) return null

  return makeRecommendation(
    tool,
    `${tool.plan} (${optimalSeats} seats)`,
    recommendedCost,
    `You have ${tool.seats} seats but only ${teamSize} team members. Reducing to ${optimalSeats} seats saves money immediately.`
  )
}

// Rule 3: Duplicate overlapping tools (2 chat tools, 2 IDE tools)
export function checkDuplicateCategory(
  tool: ToolEntry,
  allTools: ToolEntry[]
): Recommendation | null {
  const pricing = PRICING[tool.name]
  if (!pricing) return null

  const sameCategory = allTools.filter((t) => {
    const p = PRICING[t.name]
    return p && p.category === pricing.category && t.id !== tool.id
  })

  if (sameCategory.length === 0) return null

  const currentCost = monthlyTotal(tool)
  if (currentCost === 0) return null

  return makeRecommendation(
    tool,
    'Consider consolidating',
    0,
    `You're paying for multiple ${pricing.category} tools (${sameCategory.map((t) => t.name).join(', ')}). Consolidating to one tool could eliminate this cost entirely.`
  )
}

// Rule 4: Annual billing discount opportunity
export function checkAnnualDiscount(tool: ToolEntry): Recommendation | null {
  if (tool.billingCycle === 'annual') return null

  const currentCost = monthlyTotal(tool)
  if (currentCost === 0) return null

  // Most tools offer ~17% discount for annual billing
  const annualMonthlyCost = currentCost * 0.83
  const monthlySavings = currentCost - annualMonthlyCost

  if (monthlySavings < 5) return null // not worth it under $5/mo

  return makeRecommendation(
    tool,
    `${tool.plan} (Annual)`,
    annualMonthlyCost,
    `Switching to annual billing typically saves ~17%. That's $${monthlySavings.toFixed(0)}/month or $${(monthlySavings * 12).toFixed(0)}/year.`
  )
}

// Rule 5: High API spend — suggest prepaid credits
export function checkApiSpend(tool: ToolEntry): Recommendation | null {
  const pricing = PRICING[tool.name]
  if (!pricing || pricing.category !== 'api') return null

  const currentCost = monthlyTotal(tool)
  if (currentCost < 100) return null // only relevant for higher spenders

  const discountedCost = currentCost * 0.85 // prepaid typically saves ~15%

  return makeRecommendation(
    tool,
    'Prepaid Credits',
    discountedCost,
    `At $${currentCost}/month on API usage, switching to prepaid credits can save ~15% through volume discounts.`
  )
}