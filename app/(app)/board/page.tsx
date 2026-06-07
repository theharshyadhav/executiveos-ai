'use client'
// app/board/page.tsx — Full Executive Board View

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { EXECUTIVES, TIMELINE_ITEMS } from '@/lib/executives'
import { EXEC_COLORS } from '@/lib/utils'
import { Executive } from '@/types'

export default function BoardPage() {
  const { geminiKey, addActivity } = useStore()
  const [selected, setSelected] = useState<Executive | null>(null)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function quickAsk() {
    if (!selected || !question.trim()) return
    if (!geminiKey) { alert('⚠ Add your Gemini API key in Settings'); return }
    setLoading(true); setResult('')
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ask_executive', role: selected.role, question, apiKey: geminiKey }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setResult(data.result)
      addActivity({ color: selected.color, text: `${selected.role} responded via Gemini`, time: 'Just now' })
    } catch (e) {
      setResult('Error: ' + (e instanceof Error ? e.message : 'Unknown'))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Executive Board</h1>
        <p style={{ color: '#7c85a2', fontSize: 12, marginTop: 3 }}>
          8 AI executives powered by Gemini 2.0 Flash — click any to interact
        </p>
      </div>

      <div style={{ padding: '18px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Board Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {EXECUTIVES.map(exec => {
            const sel = selected?.role === exec.role
            return (
              <div
                key={exec.role}
                onClick={() => { setSelected(exec); setResult(''); setQuestion('') }}
                style={{
                  background: sel ? exec.bg : '#141b29',
                  border: `1px solid ${sel ? exec.color : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all 0.18s',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: exec.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>
                  {exec.emoji}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: exec.color, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>{exec.role}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{exec.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#7c85a2', marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: exec.status === 'thinking' ? '#f59e0b' : '#22c55e', animation: exec.status === 'thinking' ? 'pulse 1s infinite' : 'pulse 2s infinite' }} />
                  {exec.status === 'thinking' ? 'Thinking...' : 'Active'}
                </div>
                <div style={{ fontSize: 10, color: '#404868', lineHeight: 1.4, marginBottom: 8 }}>{exec.currentTask}</div>
                <div style={{ fontSize: 9, color: '#404868', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>{exec.confidence}%</span>
                  <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${exec.confidence}%`, height: '100%', background: exec.color, borderRadius: 2, transition: 'width 1s' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Executive Detail */}
        {selected && (
          <div style={{ background: '#141b29', border: `1px solid ${selected.color}40`, borderRadius: 12, padding: 16, animation: 'slideIn 0.25s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: selected.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {selected.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, color: selected.color }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: '#7c85a2', marginTop: 2 }}>{selected.description}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {selected.responsibilities.map(r => (
                    <span key={r} style={{ fontSize: 10, color: selected.color, background: `${selected.color}15`, border: `1px solid ${selected.color}30`, padding: '2px 8px', borderRadius: 20 }}>{r}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#404868', marginBottom: 3 }}>Confidence</div>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700, color: selected.color }}>{selected.confidence}%</div>
              </div>
            </div>

            {/* Quick Ask */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#404868', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 8 }}>
                Quick Ask {selected.role}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && quickAsk()}
                  placeholder={`Ask the ${selected.role} anything...`}
                  style={{
                    flex: 1, background: '#111622', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8, padding: '8px 12px', color: '#e2e6f3', fontSize: 13,
                    fontFamily: 'DM Sans', outline: 'none',
                  }}
                />
                <button onClick={quickAsk} disabled={loading}
                  style={{
                    padding: '8px 14px', background: loading ? '#1a2236' : selected.color,
                    border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12,
                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans', whiteSpace: 'nowrap',
                  }}>
                  {loading ? '⟳' : `Ask ${selected.emoji}`}
                </button>
              </div>
              {result && (
                <div style={{ marginTop: 12, padding: 12, background: '#111622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontSize: 12.5, lineHeight: 1.8, color: '#7c85a2', whiteSpace: 'pre-wrap', animation: 'slideIn 0.3s ease' }}>
                  {result}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Live Execution Timeline</div>
          <div style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', position: 'relative' }}>
                {i < TIMELINE_ITEMS.length - 1 && (
                  <div style={{ position: 'absolute', left: 9, top: 28, bottom: -8, width: 1, background: 'rgba(255,255,255,0.07)' }} />
                )}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0,
                  background: item.status === 'done' ? 'rgba(34,197,94,0.18)' : item.status === 'running' ? 'rgba(26,115,232,0.2)' : 'rgba(255,255,255,0.04)',
                  color: item.status === 'done' ? '#22c55e' : item.status === 'running' ? '#4a9eff' : '#404868',
                }}>
                  {item.status === 'done' ? '✓' : item.status === 'running' ? '◌' : '○'}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: item.status === 'done' ? '#e2e6f3' : item.status === 'running' ? '#4a9eff' : '#404868', paddingTop: 2 }}>{item.text}</div>
                  <div style={{ fontSize: 10, color: '#404868', marginTop: 1 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
