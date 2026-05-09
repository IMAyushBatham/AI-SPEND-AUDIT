import { z } from 'zod'

export const leadSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  companyName: z.string().min(1, 'Company name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  honeypot: z.string().max(0, 'Bot detected'),
})

export type LeadValues = z.infer<typeof leadSchema>
export type LeadFormErrors = Partial<Record<keyof LeadValues, { message?: string }>>