'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { EXECUTIVES } from '@/lib/executives'
import { EXEC_COLORS } from '@/lib/utils'
import { ExecutiveRole } from '@/types'
import PdfExport from '@/components/ui/PdfExport'

async function safeFetch(body: object) {
  const res = await fetch('/api/gemini', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  try { return JSON.parse(text) }
  catch { throw new Error('Server error — restart dev server') }
}

const QUICK_QS = [
  'Should we hire 3 engineers now or wait until Series A closes?',
  'What pricing strategy should we use for India market entry?',
  'How do we reduce churn below 2% this quarter?',
  'Give me a 90-day plan to reach $1M ARR',
  'What tech stack for a real-time delivery app?',
  'How should we structure our seed fundraise?',
]

export default function AskPage() {
  const { geminiKey, addActivity } = useStore()
  const [sel, setSel] = useState<ExecutiveRole>('CEO')
  const [q, setQ]     = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const exec   = EXECUTIVES.find(e => e.role === sel)!
  const colors = EXEC_COLORS[sel]
  const provColor = geminiKey.startsWith('gsk_') ? '#f55036' : '#1a73e8'

  async function ask() {
    if (!q.trim()) return
    if (!geminiKey) { alert('Add your free API key in Settings first'); return }
    setLoading(true); setResult('')
    try {
      const data = await safeFetch({ action: 'ask_executive', role: sel, question: q, apiKey: geminiKey })
      if (!data.success) throw new Error(data.error)
      setResult(data.result)
      addActivity({ color: colors.color, text: `${sel} responded to your question`, time: 'Just now' })
    } catch (e) { setResult('❌ ' + (e instanceof Error ? e.message : 'Error')) }
    setLoading(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <div style={{ padding:'20px 24px 14px', borderBottom:'1px solid var(--bd)', flexShrink:0 }}>
        <h1 style={{ fontFamily:'Syne', fontSize:20, fontWeight:700, letterSpacing:'-0.4px' }}>💬 Ask the Board</h1>
        <p style={{ color:'var(--tx2)', fontSize:12, marginTop:3 }}>Query any executive directly — AI responds in their expert persona</p>
      </div>

      <div style={{ padding:'18px 24px', flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14 }}>

        {/* Exec Selector */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {EXECUTIVES.map(e => {
            const c = EXEC_COLORS[e.role]; const active = e.role === sel
            return (
              <div key={e.role} onClick={() => { setSel(e.role); setResult('') }}
                style={{ background: active ? c.bg : 'var(--sf)', border:`1px solid ${active ? c.color : 'var(--bd)'}`, borderRadius:10, padding:'10px 12px', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>{e.emoji}</span>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color: active ? c.color : 'var(--tx2)' }}>{e.role}</div>
                  <div style={{ fontSize:10, color:'var(--tx3)', marginTop:1 }}>{e.description}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected exec banner */}
        <div style={{ background:exec.bg, border:`1px solid ${exec.color}40`, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>{exec.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:exec.color, fontSize:14 }}>{exec.name}</div>
            <div style={{ fontSize:11, color:'var(--tx2)', marginTop:2 }}>{exec.description}</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:6 }}>
              {exec.responsibilities.map(r => (
                <span key={r} style={{ fontSize:9, color:exec.color, background:`${exec.color}15`, border:`1px solid ${exec.color}30`, padding:'2px 7px', borderRadius:20 }}>{r}</span>
              ))}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:'var(--tx3)' }}>Confidence</div>
            <div style={{ fontFamily:'Syne', fontSize:24, fontWeight:700, color:exec.color }}>{exec.confidence}%</div>
          </div>
        </div>

        {/* Question Input */}
        <div style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:12, padding:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:9 }}>
            Your question for {exec.role}
          </div>
          <textarea value={q} onChange={e => setQ(e.target.value)} rows={3}
            placeholder={`Ask the ${exec.role} anything about your business...`}
            style={{ width:'100%', background:'var(--bg3)', border:'1px solid var(--bd)', borderRadius:8, padding:'10px 13px', color:'var(--tx)', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none', resize:'vertical' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
            <button onClick={ask} disabled={loading}
              style={{ padding:'9px 18px', background: loading ? 'var(--sf2)' : provColor, border:'none', borderRadius:8, color: loading ? 'var(--tx3)' : '#fff', fontWeight:700, fontSize:13, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:7 }}>
              {loading ? <><div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .8s linear infinite' }} />Thinking...</> : `🧠 Ask ${sel}`}
            </button>
            <span style={{ fontSize:9, fontWeight:700, color:provColor, background:`${provColor}15`, border:`1px solid ${provColor}30`, padding:'3px 9px', borderRadius:20 }}>
              {geminiKey.startsWith('gsk_') ? 'Groq Free' : 'Gemini Free'}
            </span>
          </div>
        </div>

        {/* Quick Questions */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:8 }}>Quick Questions</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {QUICK_QS.map(qk => (
              <button key={qk} onClick={() => setQ(qk)}
                style={{ fontSize:11, padding:'5px 11px', borderRadius:20, border:'1px solid var(--bd2)', color:'var(--tx2)', cursor:'pointer', background:'transparent', fontFamily:"'DM Sans',sans-serif" }}>
                {qk}
              </button>
            ))}
          </div>
        </div>

        {/* Response */}
        {(result || loading) && (
          <div style={{ background:'var(--bg3)', border:`1px solid ${exec.color}30`, borderRadius:12, padding:16, animation:'slideIn .3s ease' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, paddingBottom:8, borderBottom:'1px solid var(--bd)' }}>
              <span style={{ fontSize:18 }}>{exec.emoji}</span>
              <span style={{ fontWeight:700, color:exec.color }}>{exec.name}</span>
              {!loading && result && !result.startsWith('❌') && (
                <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
                  <button onClick={() => navigator.clipboard?.writeText(result)}
                    style={{ fontSize:11, color:'var(--tx3)', background:'transparent', border:'1px solid var(--bd)', borderRadius:6, padding:'5px 9px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                    📋 Copy
                  </button>
                  <PdfExport
                    title={`${sel} — ${q.slice(0, 50)}`}
                    content={result}
                    type="ask"
                    subtitle={`${exec.name} Executive Consultation`}
                    execRole={sel}
                  />
                </div>
              )}
            </div>
            {loading
              ? <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--tx3)', fontSize:13 }}><div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.1)', borderTopColor:exec.color, borderRadius:'50%', animation:'spin .8s linear infinite' }} />{exec.role} is analyzing...</div>
              : <div style={{ fontSize:13, lineHeight:1.8, color: result.startsWith('❌') ? 'var(--red)' : 'var(--tx2)', whiteSpace:'pre-wrap' }}>{result}</div>
            }
          </div>
        )}

      </div>
    </div>
  )
}
