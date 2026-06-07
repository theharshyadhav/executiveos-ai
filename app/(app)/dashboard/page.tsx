'use client'
// app/(app)/dashboard/page.tsx — Command Center

import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { EXECUTIVES, COLLAB_MESSAGES, TIMELINE_ITEMS } from '@/lib/executives'
import { parseGeminiDirectiveResponse, EXEC_COLORS } from '@/lib/utils'
import { ExecutiveRole } from '@/types'
import PdfExport from '@/components/ui/PdfExport'

const DEMO_CHIPS = [
  { label: '🛒 SmartCart — grocery delivery in India',        value: 'Launch SmartCart — AI-powered grocery delivery startup in India' },
  { label: '🧠 AI Tutor SaaS for medical students',          value: 'Build an AI tutor SaaS for medical students in India' },
  { label: '📈 Scale e-commerce to $10M ARR',               value: 'Scale my e-commerce company to $10M ARR this year' },
  { label: '🔥 Reduce burn rate by 30%',                     value: 'Reduce operational burn rate by 30% this quarter' },
  { label: '🌎 Enter US market with B2B SaaS',               value: 'Enter the US market with our B2B SaaS product' },
]

const METRICS = [
  { label: 'Monthly Revenue', value: '$284K', change: '↑ 18.4%', color: '#22c55e' },
  { label: 'Runway',          value: '14mo',  change: '↑ On track', color: '#22d3ee' },
  { label: 'Eng Velocity',    value: '94pts', change: '↑ 12% sprint', color: '#f59e0b' },
  { label: 'Team Size',       value: '23',    change: '+3 this quarter', color: '#e879f9' },
]

function Spinner({ color }: { color: string }) {
  return (
    <div style={{
      width: 14, height: 14, border: `2px solid rgba(255,255,255,0.1)`,
      borderTopColor: color, borderRadius: '50%', animation: 'spin .8s linear infinite', flexShrink: 0,
    }} />
  )
}

export default function Dashboard() {
  const { geminiKey, directiveResult, directiveLoading, setDirectiveResult, setDirectiveLoading, addActivity } = useStore()
  const [input, setInput]           = useState('')
  const [collabMsgs, setCollabMsgs] = useState(COLLAB_MESSAGES.slice(0, 4))
  const feedRef   = useRef<HTMLDivElement>(null)
  const msgIdx    = useRef(4)
  const inputRef  = useRef<HTMLInputElement>(null)

  // detect provider label for display
  const providerLabel = geminiKey.startsWith('gsk_') ? 'Groq · Llama 3.3 70B' : 'Gemini 2.0 Flash'
  const providerColor = geminiKey.startsWith('gsk_') ? '#f55036' : '#1a73e8'

  // live collab feed
  useEffect(() => {
    const iv = setInterval(() => {
      const m = COLLAB_MESSAGES[msgIdx.current % COLLAB_MESSAGES.length]
      setCollabMsgs(prev => [...prev.slice(-9), m])
      msgIdx.current++
    }, 4500)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [collabMsgs])

  async function runDirective() {
    const val = input.trim()
    if (!val) { inputRef.current?.focus(); return }
    if (!geminiKey) {
      alert('⚠ Add your free API key first.\n\nGo to Settings (bottom-left) → paste your Groq key from console.groq.com\nIt\'s 100% free, 14,400 req/day.')
      return
    }
    setDirectiveLoading(true)
    setDirectiveResult('')
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'board_directive', directive: val, apiKey: geminiKey }),
      })
      // Always parse as text first to avoid "not valid JSON" crash
      const text = await res.text()
      let data: Record<string, string>
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`Server error — got HTML instead of JSON. Restart dev server (Ctrl+C → npm run dev)`)
      }
      if (!data.success) throw new Error(data.error || 'Unknown error from API')
      setDirectiveResult(data.result)
      addActivity({ color: providerColor, text: `Board responded: "${val.slice(0, 45)}..."`, time: 'Just now' })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setDirectiveResult(`❌ ${msg}`)
    }
    setDirectiveLoading(false)
  }

  const s: React.CSSProperties = { fontFamily: "'DM Sans',sans-serif" }
  const card = (extra?: React.CSSProperties) => ({
    background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 14,
    ...extra,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Command Center</h1>
        <p style={{ color: 'var(--tx2)', fontSize: 12, marginTop: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
          AI Executive Board ·
          <span style={{ color: providerColor, fontWeight: 600 }}>{providerLabel}</span>
          · {geminiKey ? '✅ API key active' : <span style={{ color: 'var(--red)' }}>⚠ No API key — go to Settings</span>}
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Command Box */}
        <div style={card()}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 9 }}>
            🎯 BOARD DIRECTIVE — ALL 8 EXECUTIVES WILL RESPOND
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !directiveLoading && runDirective()}
              placeholder="e.g. Launch SmartCart — AI grocery delivery in India..."
              style={{
                flex: 1, background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: 8,
                padding: '10px 14px', color: 'var(--tx)', fontSize: 13, ...s, outline: 'none',
              }}
            />
            <button
              onClick={runDirective}
              disabled={directiveLoading}
              style={{
                padding: '10px 20px',
                background: directiveLoading ? 'var(--sf2)' : providerColor,
                border: 'none', borderRadius: 8,
                color: directiveLoading ? 'var(--tx3)' : '#fff',
                fontWeight: 700, fontSize: 13, cursor: directiveLoading ? 'not-allowed' : 'pointer',
                ...s, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
                transition: 'background 0.15s',
              }}
            >
              {directiveLoading ? <><Spinner color={providerColor} /> Thinking...</> : '⚡ Execute'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {DEMO_CHIPS.map(chip => (
              <button key={chip.value} onClick={() => { setInput(chip.value); inputRef.current?.focus() }}
                style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--bd2)', color: 'var(--tx2)', cursor: 'pointer', background: 'transparent', ...s, transition: 'all 0.1s' }}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Response */}
        {(directiveResult || directiveLoading) && (
          <div style={{ background: 'var(--bg3)', border: `1px solid ${providerColor}30`, borderRadius: 12, padding: 16, animation: 'slideIn .3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--bd)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: providerColor, background: `${providerColor}18`, border: `1px solid ${providerColor}35`, padding: '3px 9px', borderRadius: 20 }}>
                {geminiKey.startsWith('gsk_') ? 'Groq' : 'G Gemini'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--tx3)' }}>Executive Board — All 8 Agents</span>
              {!directiveLoading && directiveResult && !directiveResult.startsWith('❌') && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <button onClick={() => navigator.clipboard?.writeText(directiveResult)}
                    style={{ fontSize: 11, color: 'var(--tx3)', background: 'transparent', border: '1px solid var(--bd)', borderRadius: 6, padding: '5px 9px', cursor: 'pointer', ...s }}>
                    📋 Copy
                  </button>
                  <PdfExport
                    title={input || 'Board Directive'}
                    content={directiveResult}
                    type="directive"
                    subtitle="Executive Board Response — All 8 AI Agents"
                  />
                </div>
              )}
            </div>
            {directiveLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--tx3)', fontSize: 13 }}>
                <Spinner color={providerColor} />
                Board is collaborating on your directive...
              </div>
            ) : (
              <DirectiveOutput text={directiveResult} />
            )}
          </div>
        )}

        {/* Metrics */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Company Vitals</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {METRICS.map(m => (
              <div key={m.label} style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 13, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.color }} />
                <div style={{ fontSize: 10, color: 'var(--tx2)', marginBottom: 5 }}>{m.label}</div>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: '#22c55e', marginTop: 3 }}>{m.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Exec Grid */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Executive Board</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {EXECUTIVES.map(exec => (
              <div key={exec.role} style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 13, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = exec.color }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bd)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: exec.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 9 }}>
                  {exec.emoji}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: exec.color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>{exec.role}</div>
                <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{exec.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--tx2)', marginBottom: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: exec.status === 'thinking' ? 'var(--gold)' : 'var(--grn)', animation: 'pulse 2s infinite' }} />
                  {exec.status === 'thinking' ? 'Thinking...' : 'Active'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', lineHeight: 1.4, marginBottom: 7 }}>{exec.currentTask}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'var(--tx3)' }}>
                  <span>{exec.confidence}%</span>
                  <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${exec.confidence}%`, height: '100%', background: exec.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collab Feed */}
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '11px 14px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💬</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>Board Collaboration Feed</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--grn)', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', padding: '2px 7px', borderRadius: 10 }}>LIVE</span>
          </div>
          <div ref={feedRef} style={{ padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 260, overflowY: 'auto' }}>
            {collabMsgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', animation: 'slideIn .3s ease' }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: m.bg, color: m.color }}>
                  {m.exec[0]}
                </div>
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: 7, padding: '7px 10px', fontSize: 11.5, lineHeight: 1.5, color: 'var(--tx2)', flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--tx)', marginBottom: 2 }}>{m.exec} Agent</div>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Directive Output — parses [ROLE]: format ────────────────────────
function DirectiveOutput({ text }: { text: string }) {
  if (text.startsWith('❌')) {
    return <div style={{ fontSize: 13, color: 'var(--red)', lineHeight: 1.7 }}>{text}</div>
  }
  const parsed = parseGeminiDirectiveResponse(text)
  if (parsed.length === 0) {
    return <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--tx2)', whiteSpace: 'pre-wrap' }}>{text}</div>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {parsed.map(({ role, content }) => {
        const colors = EXEC_COLORS[role as ExecutiveRole] || { color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)' }
        const exec = EXECUTIVES.find(e => e.role === role)
        return (
          <div key={role} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--bd)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: colors.bg, color: colors.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginTop: 1 }}>
              {exec?.emoji || role[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.color, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{role}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.75, color: 'var(--tx2)' }}>{content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
