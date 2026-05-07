import { z } from 'zod'

export const toolEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Tool name is required'),
  plan: z.string().min(1, 'Plan is required'),
  seats: z.coerce.number().min(1, 'At least 1 seat required'),
  costPerSeat: z.coerce.number().min(0, 'Cost cannot be negative'),
  billingCycle: z.enum(['monthly', 'annual']),
  useCase: z.enum([
    'coding',
    'writing',
    'research',
    'customer_support',
    'data_analysis',
    'general',
  ]),
})

export const auditFormSchema = z.object({
  teamSize: z.coerce.number().min(1, 'Team size must be at least 1'),
  useCase: z.enum([
    'coding',
    'writing',
    'research',
    'customer_support',
    'data_analysis',
    'general',
  ]),
  tools: z
    .array(toolEntrySchema)
    .min(1, 'Add at least one tool'),
})

export type AuditFormValues = z.infer<typeof auditFormSchema>
export type ToolEntryValues = z.infer<typeof toolEntrySchema>