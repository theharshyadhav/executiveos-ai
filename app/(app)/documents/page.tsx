'use client'
// app/documents/page.tsx — AI Documents Hub

import { useState } from 'react'
import { useStore } from '@/lib/store'
import PdfExport from '@/components/ui/PdfExport'

const DOCS = [
  {
    id: 'biz-plan',   icon: '📋', title: 'Business Plan',
    desc: 'Full 40-page business plan with market analysis, competitive landscape, and growth strategy',
    owner: 'CEO & CFO', status: 'ready', formats: ['PDF', 'DOCX', 'MD'], pages: 40,
    color: '#4a9eff',
  },
  {
    id: 'tech-arch',  icon: '🏗', title: 'Technical Architecture',
    desc: 'System design, microservices breakdown, database schema, and infrastructure plan',
    owner: 'CTO', status: 'ready', formats: ['PDF', 'MD'], pages: 18,
    color: '#22d3ee',
  },
  {
    id: 'fin-model',  icon: '💰', title: 'Financial Model',
    desc: '5-year revenue projections, burn rate, unit economics, and fundraising strategy',
    owner: 'CFO', status: 'ready', formats: ['XLSX', 'PDF'], pages: 12,
    color: '#22c55e',
  },
  {
    id: 'mkt-plan',   icon: '📣', title: 'Marketing Plan',
    desc: 'Go-to-market strategy, launch campaigns, content calendar, and CAC targets by channel',
    owner: 'CMO', status: 'generating', formats: ['PDF', 'DOCX'], pages: null,
    color: '#e879f9',
  },
  {
    id: 'hiring',     icon: '👥', title: 'Hiring Plan',
    desc: 'Org structure, first 20 hires, job descriptions, interview frameworks, and comp bands',
    owner: 'CHRO', status: 'ready', formats: ['PDF', 'DOCX'], pages: 22,
    color: '#fbbf24',
  },
  {
    id: 'investor',   icon: '📊', title: 'Investor Deck Outline',
    desc: 'Full pitch deck structure, narrative arc, key slides, and talking points for Series A',
    owner: 'CEO', status: 'ready', formats: ['PPTX', 'PDF'], pages: 16,
    color: '#a78bfa',
  },
  {
    id: 'prd',        icon: '📝', title: 'Product Requirements Doc',
    desc: 'MVP feature specs, user stories, acceptance criteria, and success metrics',
    owner: 'CPO', status: 'ready', formats: ['MD', 'PDF'], pages: 28,
    color: '#2dd4bf',
  },
  {
    id: 'ops',        icon: '⚙️', title: 'Operations Playbook',
    desc: 'SOPs, vendor management, delivery operations, escalation procedures, and KPIs',
    owner: 'COO', status: 'draft', formats: ['PDF', 'DOCX'], pages: 35,
    color: '#fb923c',
  },
  {
    id: 'strategy',   icon: '🔭', title: 'Strategic Growth Plan',
    desc: '3-year expansion roadmap, market entry strategy, partnership pipeline, and M&A targets',
    owner: 'CSO', status: 'draft', formats: ['PDF', 'DOCX'], pages: 20,
    color: '#8b5cf6',
  },
]

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  ready:      { label: '✓ Ready',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  generating: { label: '⟳ Generating', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  draft:      { label: '◎ Draft',      color: '#7c85a2', bg: 'rgba(124,133,162,0.12)' },
}

export default function DocumentsPage() {
  const { geminiKey, addActivity } = useStore()
  const [generating, setGenerating] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState('')

  async function generateDoc(doc: typeof DOCS[0]) {
    if (!geminiKey) { alert('⚠ Add your free Gemini API key in Settings'); return }
    setGenerating(doc.id)
    setPreview(doc.id)
    setPreviewContent('')

    const prompts: Record<string, string> = {
      'biz-plan': `You are the CEO and CFO of SmartCart, an AI grocery delivery startup. Generate an executive summary of the business plan covering: problem statement, solution, market size, business model, traction, team, financials, and ask. 250 words, investor-ready.`,
      'tech-arch': `You are the CTO of SmartCart. Generate a technical architecture overview covering: recommended stack (Next.js, Node.js, PostgreSQL, Redis, AWS), microservices breakdown, key APIs, data flow, and scalability plan. 200 words.`,
      'fin-model': `You are the CFO of SmartCart. Generate a financial summary with: Year 1-3 ARR targets, monthly burn rate, CAC/LTV, break-even timeline, and Series A raise size and use of funds. Use specific numbers. 200 words.`,
      'mkt-plan': `You are the CMO of SmartCart, an AI grocery delivery startup targeting urban India. Generate a go-to-market strategy covering: target segments, launch channels (ranked by ROI), first 100 customers plan, content strategy, and 6-month marketing calendar. 250 words.`,
      'hiring': `You are the CHRO of SmartCart. Generate a hiring plan for the first 12 months: first 15 hires (role, timing, salary band), org structure at month 12, culture values, and key interview frameworks. 250 words.`,
      'investor': `You are the CEO of SmartCart preparing a Series A pitch. Generate a slide-by-slide outline for a 12-slide investor deck: title, problem, solution, market, product, traction, business model, go-to-market, team, financials, competition, and ask. Include key points for each slide. 300 words.`,
      'prd': `You are the CPO of SmartCart. Generate a product requirements doc for the MVP covering: 5 core features (with user stories and acceptance criteria), North Star metric, success KPIs, and out-of-scope items. 250 words.`,
      'ops': `You are the COO of SmartCart. Generate an operations playbook summary covering: delivery partner SLA, order escalation process, vendor management framework, and key operational KPIs for month 1-6. 200 words.`,
      'strategy': `You are the CSO of SmartCart. Generate a 3-year strategic growth plan covering: Phase 1 (India metro launch), Phase 2 (tier 2 cities), Phase 3 (Southeast Asia expansion), key partnerships, and M&A targets. 200 words.`,
    }

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          question: prompts[doc.id] || `Generate a professional ${doc.title} for SmartCart startup.`,
          apiKey: geminiKey,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setPreviewContent(data.result)
      addActivity({ color: doc.color, text: `${doc.owner} generated ${doc.title}`, time: 'Just now' })
    } catch (e) {
      setPreviewContent('Error: ' + (e instanceof Error ? e.message : 'Unknown'))
    }
    setGenerating(null)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>AI Documents Hub</h1>
        <p style={{ color: '#7c85a2', fontSize: 12, marginTop: 3 }}>
          Auto-generated by your executive board · Click any document to generate with Gemini
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Doc Grid */}
        <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DOCS.map(doc => {
            const s = STATUS_LABELS[doc.status]
            const isGen = generating === doc.id
            return (
              <div
                key={doc.id}
                onClick={() => generateDoc(doc)}
                style={{
                  background: preview === doc.id ? `${doc.color}10` : '#141b29',
                  border: `1px solid ${preview === doc.id ? doc.color + '40' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: 12,
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{doc.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{doc.title}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 7px', borderRadius: 20 }}>
                      {isGen ? '⟳ Generating...' : s.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#7c85a2', lineHeight: 1.4, marginBottom: 6 }}>{doc.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: '#404868' }}>{doc.owner}</span>
                    {doc.pages && <span style={{ fontSize: 10, color: '#404868' }}>{doc.pages} pages</span>}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {doc.formats.map(f => (
                        <span key={f} style={{ fontSize: 9, fontWeight: 700, color: doc.color, background: `${doc.color}15`, border: `1px solid ${doc.color}30`, padding: '1px 6px', borderRadius: 10 }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#404868', flexShrink: 0, marginTop: 2 }}>
                  {isGen ? (
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: doc.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : '→'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Preview Panel */}
        {preview && (
          <div style={{ width: 380, borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#4a9eff', background: 'rgba(26,115,232,0.1)', border: '1px solid rgba(26,115,232,0.25)', padding: '2px 8px', borderRadius: 20 }}>G Gemini</span>
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{DOCS.find(d => d.id === preview)?.title}</span>
              <button onClick={() => { setPreview(null); setPreviewContent('') }}
                style={{ background: 'transparent', border: 'none', color: '#404868', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
              {generating === preview ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#404868', fontSize: 13 }}>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4a9eff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating with Gemini...
                </div>
              ) : previewContent ? (
                <div style={{ fontSize: 12.5, lineHeight: 1.8, color: '#7c85a2', whiteSpace: 'pre-wrap' }}>
                  {previewContent}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#404868', textAlign: 'center', paddingTop: 40 }}>
                  Click a document to generate its content with Gemini AI
                </div>
              )}
            </div>
            {previewContent && (
              <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigator.clipboard?.writeText(previewContent)}
                  style={{ flex: 1, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 7, color: '#7c85a2', fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                  📋 Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([previewContent], { type: 'text/plain' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob); a.download = `${preview}.md`; a.click()
                  }}
                  style={{ flex: 1, padding: '7px', background: '#1a73e8', border: 'none', borderRadius: 7, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                  ⬇ MD
                </button>
                <PdfExport
                  title={DOCS.find(d => d.id === preview)?.title || 'Document'}
                  content={previewContent}
                  type="document"
                  subtitle={`Generated by ${DOCS.find(d => d.id === preview)?.owner || 'Executive Board'}`}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
