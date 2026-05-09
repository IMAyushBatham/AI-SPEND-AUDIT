import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('audits')
      .select('share_token, team_size, use_case, results, total_monthly_spend, potential_savings, created_at')
      .eq('share_token', params.token)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Strip any personal data before returning
    return NextResponse.json({
      shareToken: data.share_token,
      teamSize: data.team_size,
      useCase: data.use_case,
      totalMonthlySpend: data.total_monthly_spend,
      potentialSavings: data.potential_savings,
      createdAt: data.created_at,
      results: data.results,
    })
  } catch (err) {
    console.error('Fetch audit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}