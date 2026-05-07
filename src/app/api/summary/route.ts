import { NextRequest, NextResponse } from 'next/server'
import type { AuditResult, AuditInput } from '@/types'

function fallbackSummary(input: AuditInput, result: AuditResult): string {
  const { totalMonthlySpend, potentialMonthlySavings, recommendations } = result
  const percent = totalMonthlySpend > 0
    ? Math.round((potentialMonthlySavings / totalMonthlySpend) * 100)
    : 0

  if (recommendations.length === 0) {
    return `Your team of ${input.teamSize} is spending $${totalMonthlySpend}/month on AI tools. Based on our analysis, your current setup is well-optimized with no major savings opportunities identified. Keep monitoring usage as your team grows.`
  }

  const topRec = recommendations[0]
  return `Your team of ${input.teamSize} is spending $${totalMonthlySpend}/month on AI tools. We found ${recommendations.length} optimization opportunity${recommendations.length > 1 ? 's' : ''} that could save you $${potentialMonthlySavings}/month — that's ${percent}% of your current spend. The biggest win: ${topRec.reason} Consider acting on these recommendations to save $${result.potentialAnnualSavings}/year.`
}

export async function POST(req: NextRequest) {
  try {
    const { input, result }: { input: AuditInput; result: AuditResult } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ summary: fallbackSummary(input, result) })
    }

    const prompt = `You are an AI spend analyst. Write a concise 80-100 word executive summary for a startup audit report.

Data:
- Team size: ${input.teamSize}
- Primary use case: ${input.useCase}
- Tools used: ${input.tools.map((t) => `${t.name} (${t.plan}, ${t.seats} seats)`).join(', ')}
- Total monthly spend: $${result.totalMonthlySpend}
- Potential monthly savings: $${result.potentialMonthlySavings}
- Number of recommendations: ${result.recommendations.length}
- Top recommendation: ${result.recommendations[0]?.reason ?? 'None'}

Write a professional, direct summary. No bullet points. No markdown. Plain text only.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ summary: fallbackSummary(input, result) })
    }

    const data = await response.json()
    const summary = data.content?.[0]?.text ?? fallbackSummary(input, result)

    return NextResponse.json({ summary })
  } catch {
    return NextResponse.json({ summary: '' }, { status: 500 })
  }
}