// lib/gemini.ts — Multi-provider AI client: Groq (primary) + Gemini (fallback)

import { ExecutiveRole } from '@/types'

const GROQ_BASE  = 'https://api.groq.com/openai/v1'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta'
const GEMINI_MODEL = 'gemini-2.0-flash'

// ── Detect provider from key format ────────────────────────────────
function isGroqKey(key: string) { return key.startsWith('gsk_') }

// ── Groq call ───────────────────────────────────────────────────────
async function callGroq(prompt: string, key: string, system?: string): Promise<string> {
  const messages: { role: string; content: string }[] = []
  if (system) messages.push({ role: 'system', content: system })
  messages.push({ role: 'user', content: prompt })

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.85, max_tokens: 2048 }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ── Gemini call ─────────────────────────────────────────────────────
async function callGemini(prompt: string, key: string, system?: string): Promise<string> {
  const fullPrompt = system ? `${system}\n\n${prompt}` : prompt
  const res = await fetch(`${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini error ${res.status}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// ── Smart router ────────────────────────────────────────────────────
export async function aiGenerate(prompt: string, key: string, system?: string): Promise<string> {
  if (!key) throw new Error('NO_API_KEY')
  return isGroqKey(key) ? callGroq(prompt, key, system) : callGemini(prompt, key, system)
}

// Keep backward compat alias
export const geminiGenerate = aiGenerate

// ── Executive personas ──────────────────────────────────────────────
export const EXECUTIVE_SYSTEM_PROMPTS: Record<ExecutiveRole, string> = {
  CEO:  'You are the CEO of a fast-growing startup. You think about vision, strategy, market positioning, competitive advantage, fundraising, and long-term growth. Give decisive, specific recommendations with real numbers.',
  CTO:  'You are the CTO of a fast-growing startup. You own technical architecture, engineering velocity, security, infrastructure, and GitLab project management. Recommend specific tech stacks, patterns, and sprint plans.',
  CFO:  'You are the CFO of a fast-growing startup. You own unit economics, burn rate, runway, fundraising, pricing models, and financial risk. Always cite specific numbers: CAC, LTV, MRR, burn, runway months.',
  COO:  'You are the COO of a fast-growing startup. You own operations, execution, process optimization, vendor management, and scaling. Be systematic and metrics-driven with concrete improvement plans.',
  CMO:  'You are the CMO of a fast-growing startup. You own brand, customer acquisition, content, SEO, social, and growth. Recommend specific channels, budgets, and measurable KPIs.',
  CHRO: 'You are the CHRO of a fast-growing startup. You own talent, org design, hiring, culture, performance, and comp. Give specific hiring plans with roles, timelines, and salary ranges.',
  CSO:  'You are the Chief Strategy Officer of a fast-growing startup. You own long-term positioning, market expansion, partnerships, and competitive intelligence. Use strategic frameworks with data.',
  CPO:  'You are the Chief Product Officer of a fast-growing startup. You own product-market fit, roadmap, user research, OKRs, and North Star metrics. Prioritize ruthlessly with user impact data.',
}

// ── Ask single executive ────────────────────────────────────────────
export async function askExecutive(
  role: ExecutiveRole, question: string, context?: string, apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || ''
  const system = EXECUTIVE_SYSTEM_PROMPTS[role]
  const prompt = `${context ? `Company Context: ${context}\n\n` : ''}Founder's question: "${question}"\n\nGive expert, actionable advice from your ${role} perspective. Be specific with numbers and timelines. 150-200 words max. Use bullet points where helpful.`
  return aiGenerate(prompt, key, system)
}

// ── All 8 execs board directive ─────────────────────────────────────
export async function runBoardDirective(directive: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || ''
  const system = 'You are an AI Executive Board for a startup. You contain 8 world-class executives: CEO, CTO, CFO, COO, CMO, CHRO, CSO, CPO. Each contributes their domain expertise with specific, actionable insights and real numbers.'
  const prompt = `Board directive from founder: "${directive}"

Each executive responds with their unique perspective. Format EXACTLY like this (keep the brackets):
[CEO]: <specific strategic response with numbers>
[CTO]: <specific technical response with stack/timeline>
[CFO]: <specific financial response with numbers>
[COO]: <specific operational response>
[CMO]: <specific marketing response with channels/budget>
[CHRO]: <specific people response with roles/timelines>
[CSO]: <specific strategy response with market insight>
[CPO]: <specific product response with features/metrics>

Rules: Each response 2-3 sentences. Use real numbers. Be specific not generic. Total under 500 words.`
  return aiGenerate(prompt, key, system)
}

// ── Full startup blueprint ──────────────────────────────────────────
export async function buildStartupBlueprint(idea: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || ''
  const system = 'You are a world-class AI Executive Board and startup advisory team. You generate comprehensive, investor-ready startup blueprints with specific numbers, realistic timelines, and immediately actionable steps.'
  const prompt = `Generate a detailed startup blueprint for: "${idea}"

## 🎯 Problem & Market
- Core problem (specific pain point)
- TAM / SAM / SOM with $ numbers
- Target customer persona

## 💼 Business Model
- Revenue streams with pricing tiers
- Unit economics: CAC target, LTV target, LTV:CAC ratio
- Break-even timeline

## 🏗 Tech Architecture (CTO)
- Recommended stack with reasons
- Key services / APIs needed
- MVP scope vs Phase 2

## 🗺 90-Day Roadmap
- Sprint 1 (Days 1-30): Core foundation
- Sprint 2 (Days 31-60): Feature complete
- Sprint 3 (Days 61-90): Beta launch

## 📣 Go-To-Market (CMO)
- Top 3 channels ranked by ROI
- First 100 customers plan
- Month 1 marketing budget

## 👥 Hiring Plan (CHRO)
- First 8 hires: role, month, salary range
- Org chart at month 12

## 💰 Financial Projections (CFO)
- MRR targets: M3 / M6 / M12
- ARR targets: Year 1 / 2 / 3
- Seed raise: amount + use of funds

## ⚠ Top 3 Risks & Mitigations
## 🦊 GitLab Sprint 1 Issues (10 tickets with priority)

Be extremely specific. No vague advice. Real numbers only.`
  return aiGenerate(prompt, key, system)
}

// ── Market analysis ─────────────────────────────────────────────────
export async function runMarketAnalysis(business: string, question: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || ''
  const prompt = `You are a senior startup analyst for "${business}". Question: "${question}". Give: 1) Direct answer, 2) Supporting data with numbers, 3) Specific recommendation + next steps, 4) Key risk. 200 words max. Be direct.`
  return aiGenerate(prompt, key)
}
