import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validators/lead'
import type { AuditInput, AuditResult } from '@/types'

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }

  if (entry.count >= 5) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { input, result, lead } = body as {
      input: AuditInput
      result: AuditResult
      lead: unknown
    }

    // Validate lead
    const parsed = leadSchema.safeParse(lead)
    if (!parsed.success) {
      return NextResponse.json(
       { error: parsed.error.issues[0]?.message ?? 'Validation error' },
        { status: 400 }
      )
    }

    // Honeypot check
    if (parsed.data.honeypot !== '') {
      return NextResponse.json({ success: true }) // silently reject bots
    }

    const supabase = await createClient()

    // Upsert audit
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .upsert(
        {
          share_token: result.shareToken,
          team_size: input.teamSize,
          use_case: input.useCase,
          tools: input.tools,
          results: result,
          total_monthly_spend: result.totalMonthlySpend,
          potential_savings: result.potentialMonthlySavings,
        },
        { onConflict: 'share_token' }
      )
      .select('id')
      .single()

    if (auditError) {
  console.error('Audit save error:', JSON.stringify(auditError, null, 2))
  return NextResponse.json({ error: auditError.message ?? 'Failed to save audit' }, { status: 500 })
}

    // Save lead
    const { error: leadError } = await supabase.from('leads').insert({
      audit_id: audit.id,
      email: parsed.data.email,
      company_name: parsed.data.companyName,
      role: parsed.data.role,
      honeypot: parsed.data.honeypot,
    })

    if (leadError) {
      console.error('Lead save error:', leadError)
    }

    return NextResponse.json({
      success: true,
      shareUrl: `/share/${result.shareToken}`,
    })
  } catch (err: any) {
  console.error('Save error:', err?.message ?? err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}