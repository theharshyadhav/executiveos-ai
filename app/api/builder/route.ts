// app/api/builder/route.ts — Startup Blueprint Builder

import { NextRequest, NextResponse } from 'next/server'
import { buildStartupBlueprint } from '@/lib/gemini'
import { ctaSetupWorkspace } from '@/lib/gitlab'

export async function POST(req: NextRequest) {
  try {
    const { idea, setupGitlab = false, apiKey } = await req.json()

    if (!idea) {
      return NextResponse.json({ error: 'idea is required' }, { status: 400 })
    }

    // 1. Generate full blueprint with Gemini
    const blueprint = await buildStartupBlueprint(idea, apiKey)

    let gitlabWorkspace = null

    // 2. Optionally set up GitLab workspace via CTO Agent
    if (setupGitlab && process.env.GITLAB_TOKEN) {
      try {
        const projectName = idea.split('—')[0].trim().slice(0, 30)
        gitlabWorkspace = await ctaSetupWorkspace(projectName, `Auto-created by ExecutiveOS AI for: ${idea}`)
      } catch (e) {
        console.error('GitLab setup failed:', e)
        // Non-fatal — blueprint still returns
      }
    }

    return NextResponse.json({
      success: true,
      blueprint,
      gitlabWorkspace,
      idea,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Builder error'
    return NextResponse.json({ error: message, success: false }, { status: 500 })
  }
}
