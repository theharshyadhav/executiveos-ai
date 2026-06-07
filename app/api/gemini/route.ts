// app/api/gemini/route.ts — bulletproof AI endpoint

import { NextRequest, NextResponse } from 'next/server'
import { runBoardDirective, askExecutive, buildStartupBlueprint, runMarketAnalysis, aiGenerate } from '@/lib/gemini'
import { ExecutiveRole } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, string>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body', success: false }, { status: 400 })
    }

    const { action, directive, role, question, context, idea, business, apiKey } = body
    const key = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || ''

    if (!key) {
      return NextResponse.json({
        error: 'No API key found. Go to Settings → paste your free Groq key (console.groq.com)',
        success: false,
      }, { status: 401 })
    }

    switch (action) {
      case 'board_directive':
        if (!directive) return NextResponse.json({ error: 'directive is required' }, { status: 400 })
        return NextResponse.json({ success: true, result: await runBoardDirective(directive, key) })

      case 'ask_executive':
        if (!role || !question) return NextResponse.json({ error: 'role and question required' }, { status: 400 })
        return NextResponse.json({ success: true, result: await askExecutive(role as ExecutiveRole, question, context, key) })

      case 'startup_blueprint':
        if (!idea) return NextResponse.json({ error: 'idea is required' }, { status: 400 })
        return NextResponse.json({ success: true, result: await buildStartupBlueprint(idea, key) })

      case 'market_analysis':
        if (!business || !question) return NextResponse.json({ error: 'business and question required' }, { status: 400 })
        return NextResponse.json({ success: true, result: await runMarketAnalysis(business, question, key) })

      case 'generate':
        if (!question) return NextResponse.json({ error: 'question is required' }, { status: 400 })
        return NextResponse.json({ success: true, result: await aiGenerate(question, key) })

      default:
        return NextResponse.json({ error: `Unknown action: "${action}"` }, { status: 400 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('[/api/gemini]', message)
    return NextResponse.json({ error: message, success: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    providers: {
      groq:   { configured: !!process.env.GROQ_API_KEY,   model: 'llama-3.3-70b-versatile', free: '14400 req/day' },
      gemini: { configured: !!process.env.GEMINI_API_KEY, model: 'gemini-2.0-flash',         free: '1500 req/day'  },
    },
    actions: ['board_directive','ask_executive','startup_blueprint','market_analysis','generate'],
  })
}
