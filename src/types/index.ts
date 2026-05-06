export type UseCase =
  | 'coding'
  | 'writing'
  | 'research'
  | 'customer_support'
  | 'data_analysis'
  | 'general'

export type BillingCycle = 'monthly' | 'annual'

export interface ToolEntry {
  id: string
  name: string
  plan: string
  seats: number
  costPerSeat: number
  billingCycle: BillingCycle
  useCase: UseCase
}

export interface AuditInput {
  email?: string
  teamSize: number
  tools: ToolEntry[]
}

export interface Recommendation {
  toolId: string
  toolName: string
  currentPlan: string
  currentMonthlyCost: number
  recommendedPlan: string
  recommendedMonthlyCost: number
  monthlySavings: number
  annualSavings: number
  reason: string
}

export interface AuditResult {
  id: string
  shareToken: string
  totalMonthlySpend: number
  totalAnnualSpend: number
  potentialMonthlySavings: number
  potentialAnnualSavings: number
  recommendations: Recommendation[]
  aiSummary?: string
  createdAt: string
}

export interface Audit {
  input: AuditInput
  result: AuditResult
}