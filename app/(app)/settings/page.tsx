'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'

type Provider = 'groq' | 'gemini'

const PROVIDERS = {
  groq: {
    name: 'Groq (Recommended)',
    subtitle: '✓ Truly free · 14,400 req/day · Fastest inference · No quota issues',
    color: '#f55036',
    bg: 'rgba(245,80,54,0.12)',
    border: 'rgba(245,80,54,0.3)',
    placeholder: 'gsk_...paste your Groq key here',
    link: 'https://console.groq.com/keys',
    linkLabel: 'console.groq.com',
    model: 'llama-3.3-70b-versatile',
    steps: [
      { n: 1, title: 'Go to console.groq.com', desc: 'Sign up free — no credit card, no billing ever' },
      { n: 2, title: 'Click "API Keys" → "Create API Key"', desc: 'Name it "executiveos-ai" → Create' },
      { n: 3, title: 'Copy the key (starts with gsk_)', desc: 'Paste below → Save. 14,400 free requests/day!' },
    ],
    testEndpoint: async (key: string) => {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: 'Say OK' }], max_tokens: 5 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || `Error ${res.status}`)
      return true
    },
  },
  gemini: {
    name: 'Google Gemini',
    subtitle: 'Free tier · May have regional quota issues in India',
    color: '#1a73e8',
    bg: 'rgba(26,115,232,0.12)',
    border: 'rgba(26,115,232,0.3)',
    placeholder: 'Paste your Gemini API key from AI Studio...',
    link: 'https://aistudio.google.com/app/apikey',
    linkLabel: 'aistudio.google.com',
    model: 'gemini-2.0-flash',
    steps: [
      { n: 1, title: 'Go to aistudio.google.com', desc: 'Sign in with any Google account' },
      { n: 2, title: 'Click "Get API Key" → "Create API key in new project"', desc: 'Create a fresh project each time for fresh quota' },
      { n: 3, title: 'Copy and paste the key below', desc: 'Note: India accounts may have limit:0 quota issues — use Groq instead' },
    ],
    testEndpoint: async (key: string) => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: 'Say OK' }] }] }) }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || `Error ${res.status}`)
      return true
    },
  },
}

export default function SettingsPage() {
  const { geminiKey, setGeminiKey } = useStore()
  const [provider, setProvider] = useState<Provider>(geminiKey?.startsWith('gsk_') ? 'groq' : 'groq')
  const [keyInput, setKeyInput] = useState(geminiKey || '')
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [testing, setTesting] = useState(false)
  const [gitlabToken, setGitlabToken] = useState('')

  const p = PROVIDERS[provider]

  async function saveAndTest() {
    const trimmed = keyInput.trim()
    if (!trimmed || trimmed.length < 10) {
      setStatus({ ok: false, msg: 'Please paste your full API key' }); return
    }
    setTesting(true); setStatus(null)
    try {
      await p.testEndpoint(trimmed)
      setGeminiKey(trimmed)
      setStatus({ ok: true, msg: `✅ ${p.name} verified and saved! AI Board is now fully active.` })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Verification failed'
      setStatus({ ok: false, msg: `❌ ${msg}` })
    }
    setTesting(false)
  }

  const card = (style: React.CSSProperties, children: React.ReactNode) => (
    <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 18, ...style }}>
      {children}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--bd)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>⚙️ Settings</h1>
        <p style={{ color: 'var(--tx2)', fontSize: 12, marginTop: 3 }}>Configure your free API keys — no billing ever required</p>
      </div>

      <div style={{ padding: '18px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* PROVIDER SELECTOR */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 10 }}>
            Choose AI Provider
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(Object.entries(PROVIDERS) as [Provider, typeof PROVIDERS.groq][]).map(([key, prov]) => (
              <div key={key} onClick={() => { setProvider(key); setStatus(null) }}
                style={{
                  background: provider === key ? prov.bg : 'var(--sf)',
                  border: `1px solid ${provider === key ? prov.color : 'var(--bd)'}`,
                  borderRadius: 10, padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 26, height: 26, background: prov.color, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12 }}>
                    {key === 'groq' ? 'G' : 'G'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{prov.name}</div>
                    {key === 'groq' && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: 'var(--grn)', border: '1px solid rgba(34,197,94,0.3)', padding: '1px 6px', borderRadius: 10 }}>RECOMMENDED</span>}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: provider === key ? prov.color : 'var(--tx3)' }}>{prov.subtitle}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 4 }}>Model: {prov.model}</div>
              </div>
            ))}
          </div>
        </div>

        {/* KEY INPUT */}
        <div style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, background: p.color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>
              {provider === 'groq' ? 'G' : 'G'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name} API Key</div>
              <div style={{ fontSize: 11, color: 'var(--grn)' }}>{p.subtitle}</div>
            </div>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 8 }}>Your API Key</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveAndTest()}
              placeholder={p.placeholder}
              style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: 8, padding: '9px 13px', color: 'var(--tx)', fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none' }}
            />
            <button onClick={saveAndTest} disabled={testing}
              style={{ padding: '9px 16px', background: testing ? 'var(--sf2)' : p.color, border: 'none', borderRadius: 8, color: testing ? 'var(--tx3)' : '#fff', fontWeight: 700, fontSize: 13, cursor: testing ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap' }}>
              {testing ? '⟳ Testing...' : '💾 Save & Test'}
            </button>
          </div>

          {status && (
            <div style={{ marginTop: 10, fontSize: 12, color: status.ok ? 'var(--grn)' : 'var(--red)', lineHeight: 1.5 }}>
              {status.msg}
            </div>
          )}
        </div>

        {/* HOW TO GET KEY */}
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
            🔑 How to get your FREE {p.name} key
          </div>
          {p.steps.map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${p.color}25`, color: p.color, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {step.n}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{step.title}</div>
                <div style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 2 }}>{step.desc}</div>
              </div>
            </div>
          ))}
          <a href={p.link} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', fontSize: 13, color: p.color, fontWeight: 700, marginTop: 4 }}>
            → Open {p.linkLabel} (free) ↗
          </a>
        </div>

        {/* Why Groq banner */}
        {provider === 'gemini' && (
          <div style={{ background: 'rgba(245,80,54,0.08)', border: '1px solid rgba(245,80,54,0.25)', borderRadius: 12, padding: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f55036', marginBottom: 4 }}>Getting quota errors with Gemini?</div>
              <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>
                Google restricts free Gemini quota for India-based accounts (limit: 0). Switch to <strong style={{ color: '#fff' }}>Groq</strong> — it's faster, truly free (14,400 req/day), and has zero regional restrictions. Same quality answers.
              </div>
              <button onClick={() => { setProvider('groq'); setKeyInput(''); setStatus(null) }}
                style={{ marginTop: 10, padding: '6px 14px', background: '#f55036', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
                Switch to Groq →
              </button>
            </div>
          </div>
        )}

        {/* GitLab */}
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>🦊</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>GitLab Token</div>
              <div style={{ fontSize: 11, color: 'var(--tx2)' }}>CTO Agent creates repos, milestones & issues</div>
            </div>
          </div>
          <input type="password" value={gitlabToken} onChange={e => setGitlabToken(e.target.value)}
            placeholder="glpat-...your legacy token"
            style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--bd)', borderRadius: 8, padding: '9px 13px', color: 'var(--tx)', fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: 'none' }} />
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 8 }}>
            Get from: gitlab.com → Profile → Access Tokens → Legacy token → Scopes: api, read_user, read_repository, write_repository
          </div>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 6, background: 'var(--bg3)', borderRadius: 7, padding: 9 }}>
            ⚠ Add to <code style={{ color: 'var(--gm2)' }}>.env.local</code> as <code style={{ color: 'var(--gm2)' }}>GITLAB_TOKEN=glpat-...</code> for the backend API to use it.
          </div>
        </div>

        {/* MongoDB */}
        <div style={{ background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>🍃</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>MongoDB Atlas</div>
              <div style={{ fontSize: 11, color: 'var(--tx2)' }}>Optional — saves history between sessions</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 10 }}>Optional</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
            Add <code style={{ color: 'var(--gm2)', fontSize: 11 }}>MONGODB_URI</code> to .env.local when needed. App works fully without it.
          </div>
          <a href="https://mongodb.com/atlas" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: 12, color: 'var(--gm2)', marginTop: 8 }}>→ Get free MongoDB Atlas ↗</a>
        </div>

      </div>
    </div>
  )
}
