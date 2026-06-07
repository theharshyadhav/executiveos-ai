'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import PdfExport from '@/components/ui/PdfExport'

const DEMOS = [
  { label: '🛒 SmartCart', value: 'SmartCart — AI-powered grocery delivery with smart reordering for premium urban India' },
  { label: '🧠 AI Tutor',  value: 'AI Tutor — personalized learning assistant for competitive exam students in India (JEE, NEET, UPSC)' },
  { label: '💪 FitOS',     value: 'FitOS — AI fitness coach and meal planner for busy urban professionals in India' },
  { label: '📈 StockSense',value: 'StockSense — AI stock market analysis and portfolio management SaaS for retail investors' },
]

const STEPS = [
  { role:'CEO',  label:'Defining vision, problem & opportunity...', emoji:'👑' },
  { role:'CSO',  label:'Running market analysis & TAM/SAM/SOM...',  emoji:'🔭' },
  { role:'CFO',  label:'Building financial model & projections...',  emoji:'💰' },
  { role:'CTO',  label:'Designing technical architecture & stack...',emoji:'⚙️' },
  { role:'CTO',  label:'Creating GitLab workspace & sprint issues...',emoji:'🦊' },
  { role:'CMO',  label:'Crafting go-to-market strategy...',          emoji:'📣' },
  { role:'CHRO', label:'Building hiring plan & org structure...',    emoji:'👥' },
  { role:'CPO',  label:'Finalizing product roadmap & OKRs...',      emoji:'🎯' },
  { role:'ALL',  label:'Synthesizing full investor-ready blueprint...',emoji:'⚡' },
]

export default function BuilderPage() {
  const { geminiKey, addActivity } = useStore()
  const [idea, setIdea]     = useState('')
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(-1)
  const [result, setResult] = useState('')
  const provColor = geminiKey.startsWith('gsk_') ? '#f55036' : '#1a73e8'

  async function build() {
    if (!idea.trim()) return
    if (!geminiKey) { alert('Add your free API key in Settings first'); return }
    setLoading(true); setResult(''); setStepIdx(0)

    let i = 0
    const iv = setInterval(() => { i++; setStepIdx(i); if (i >= STEPS.length - 1) clearInterval(iv) }, 900)

    try {
      const res  = await fetch('/api/gemini', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'startup_blueprint', idea, apiKey: geminiKey }),
      })
      const text = await res.text()
      let data: Record<string, string>
      try { data = JSON.parse(text) }
      catch { throw new Error('Server error — restart dev server (Ctrl+C → npm run dev)') }

      clearInterval(iv); setStepIdx(STEPS.length)
      if (!data.success) throw new Error(data.error)
      setTimeout(() => { setResult(data.result); setLoading(false) }, 600)
      addActivity({ color: provColor, text: `Blueprint generated: ${idea.slice(0, 40)}...`, time: 'Just now' })
    } catch (e) {
      clearInterval(iv)
      setResult('❌ ' + (e instanceof Error ? e.message : 'Unknown error'))
      setLoading(false)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      <div style={{ padding:'20px 24px 14px', borderBottom:'1px solid var(--bd)', flexShrink:0 }}>
        <h1 style={{ fontFamily:'Syne', fontSize:20, fontWeight:700, letterSpacing:'-0.4px' }}>⬡ Startup Builder</h1>
        <p style={{ color:'var(--tx2)', fontSize:12, marginTop:3 }}>Enter your idea — the full board generates a complete investor-ready blueprint</p>
      </div>

      <div style={{ padding:'18px 24px', flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14 }}>

        <div style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:10 }}>💡 Your Startup Idea</div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={idea} onChange={e => setIdea(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && build()}
              placeholder="e.g. SmartCart — AI grocery delivery with smart reordering..."
              style={{ flex:1, background:'var(--bg3)', border:'1px solid var(--bd)', borderRadius:8, padding:'10px 13px', color:'var(--tx)', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none' }} />
            <button onClick={build} disabled={loading}
              style={{ padding:'10px 20px', background: loading ? 'var(--sf2)' : provColor, border:'none', borderRadius:8, color: loading ? 'var(--tx3)' : '#fff', fontWeight:700, fontSize:13, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }}>
              {loading ? '⟳ Building...' : '🚀 Build with AI'}
            </button>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:10 }}>
            {DEMOS.map(d => (
              <button key={d.label} onClick={() => setIdea(d.value)}
                style={{ fontSize:11, padding:'4px 10px', borderRadius:20, border:'1px solid var(--bd2)', color:'var(--tx2)', cursor:'pointer', background:'transparent', fontFamily:"'DM Sans',sans-serif" }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Build Progress */}
        {loading && (
          <div style={{ background:'var(--sf)', border:`1px solid ${provColor}30`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:provColor, marginBottom:12 }}>⚡ Executive Board Building Your Blueprint...</div>
            {STEPS.map((step, i) => {
              const status = i < stepIdx ? 'done' : i === stepIdx ? 'run' : 'pend'
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 0' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, flexShrink:0,
                    background: status==='done'?'rgba(34,197,94,0.18)':status==='run'?`${provColor}25`:'rgba(255,255,255,0.05)',
                    color: status==='done'?'var(--grn)':status==='run'?provColor:'var(--tx3)',
                  }}>
                    {status==='done'?'✓':status==='run'?step.emoji:'○'}
                  </div>
                  <div style={{ fontSize:12, color: status==='done'?'var(--tx)':status==='run'?provColor:'var(--tx3)' }}>{step.label}</div>
                  {status==='run' && <div style={{ width:10, height:10, border:`1.5px solid ${provColor}40`, borderTopColor:provColor, borderRadius:'50%', animation:'spin .8s linear infinite', marginLeft:4 }} />}
                </div>
              )
            })}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div style={{ background:'var(--bg3)', border:`1px solid ${provColor}25`, borderRadius:12, padding:16, animation:'slideIn .3s ease' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, paddingBottom:10, borderBottom:'1px solid var(--bd)' }}>
              <span style={{ fontSize:10, fontWeight:700, color:provColor, background:`${provColor}18`, border:`1px solid ${provColor}35`, padding:'3px 9px', borderRadius:20 }}>
                {geminiKey.startsWith('gsk_') ? 'Groq · Llama 3.3 70B' : 'G Gemini'}
              </span>
              <span style={{ fontSize:11, color:'var(--tx3)' }}>Full Startup Blueprint</span>
              {!result.startsWith('❌') && (
                <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
                  <button onClick={() => {
                    const blob = new Blob([result], { type:'text/plain' })
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
                    a.download = `${idea.split('—')[0].trim()}-blueprint.md`; a.click()
                  }} style={{ fontSize:11, color:'#fff', background:provColor, border:'none', borderRadius:6, padding:'5px 10px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
                    ⬇ MD
                  </button>
                  <PdfExport
                    title={idea.split('—')[0].trim() || 'Startup Blueprint'}
                    content={result}
                    type="blueprint"
                    subtitle="Complete Investor-Ready Startup Blueprint"
                  />
                </div>
              )}
            </div>
            <div style={{ fontSize:13, lineHeight:1.9, color: result.startsWith('❌') ? 'var(--red)' : 'var(--tx2)', whiteSpace:'pre-wrap' }}>{result}</div>
          </div>
        )}

      </div>
    </div>
  )
}
