'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import { TIMELINE_ITEMS } from '@/lib/executives'

const S: React.CSSProperties = { textDecoration: 'none' }

const NAV = [
  { label: 'Dashboard',       href: '/dashboard', icon: '⊞', badge: '',   group: 'Workspace'     },
  { label: 'Executive Board', href: '/board',     icon: '♟', badge: '8',  group: 'Workspace'     },
  { label: 'Ask the Board',   href: '/ask',       icon: '💬', badge: 'AI', group: 'Workspace'     },
  { label: 'Projects',        href: '/projects',  icon: '◈', badge: '3',  group: 'Workspace'     },
  { label: 'GitLab',          href: '/gitlab',    icon: '🦊', badge: '',   group: 'Integrations'  },
  { label: 'Tasks',           href: '/tasks',     icon: '✓', badge: '24', group: 'Integrations'  },
  { label: 'Analytics',       href: '/analytics', icon: '◉', badge: '',   group: 'Intelligence'  },
  { label: 'Documents',       href: '/documents', icon: '◧', badge: '',   group: 'Intelligence'  },
  { label: 'Startup Builder', href: '/builder',   icon: '⬡', badge: '',   group: 'Intelligence'  },
  { label: 'Settings',        href: '/settings',  icon: '⚙', badge: '',   group: 'Account'       },
]

const GROUPS = ['Workspace','Integrations','Intelligence','Account']

const INSIGHTS = [
  { icon: '⚠', txt: 'Burn rate exceeds runway in month 11 without Series A' },
  { icon: '🎯', txt: 'CAC in Bangalore 32% lower than Mumbai — prioritize there' },
  { icon: '💡', txt: 'AI reorder feature can boost AOV by 23%' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { activities, geminiKey } = useStore()

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)', color:'var(--tx)', fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── TOP NAV ── */}
      <div style={{ height:50, background:'var(--bg2)', borderBottom:'1px solid var(--bd)', display:'flex', alignItems:'center', padding:'0 16px', gap:10, flexShrink:0 }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, letterSpacing:'-0.3px', display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, background:'var(--gm)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>G</div>
          ExecutiveOS
          <span style={{ fontSize:9, fontWeight:700, background:'rgba(26,115,232,0.2)', color:'var(--gm2)', border:'1px solid rgba(26,115,232,0.35)', padding:'2px 7px', borderRadius:20, letterSpacing:'0.8px', textTransform:'uppercase' }}>AI</span>
          <span style={{ fontSize:9, fontWeight:700, background:'rgba(34,197,94,0.15)', color:'var(--grn)', border:'1px solid rgba(34,197,94,0.3)', padding:'2px 7px', borderRadius:20 }}>FREE</span>
        </div>
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--tx2)' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--grn)', animation:'pulse 2s infinite' }} />
          {geminiKey ? 'Gemini Active' : 'Add API Key'}
        </div>
        <Link href="/builder" style={S}>
          <button style={{ height:28, padding:'0 11px', border:'1px solid var(--bd2)', borderRadius:6, background:'transparent', color:'var(--tx2)', cursor:'pointer', fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
            🚀 Builder
          </button>
        </Link>
        <Link href="/settings" style={S}>
          <button style={{ height:28, padding:'0 11px', background:'var(--gm)', border:'none', borderRadius:6, color:'#fff', cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>
            🔑 API Key
          </button>
        </Link>
      </div>

      {/* ── BODY ── */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* SIDEBAR */}
        <div style={{ width:210, background:'var(--bg2)', borderRight:'1px solid var(--bd)', padding:'10px 0', flexShrink:0, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          {GROUPS.map(group => (
            <div key={group}>
              <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'1px', padding:'8px 14px 4px' }}>{group}</div>
              {NAV.filter(n => n.group === group).map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} style={S}>
                    <div style={{
                      display:'flex', alignItems:'center', gap:8, padding:'7px 12px',
                      borderRadius:8, margin:'1px 6px', cursor:'pointer', fontSize:12.5,
                      color: active ? 'var(--gm2)' : 'var(--tx2)',
                      background: active ? 'rgba(26,115,232,0.14)' : 'transparent',
                      transition:'all 0.1s',
                    }}>
                      <span style={{ width:15, textAlign:'center', fontSize:13, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                      {item.label}
                      {item.badge && (
                        <span style={{ marginLeft:'auto', fontSize:9, fontWeight:700, background:'rgba(79,142,247,0.2)', color:'#7cb3ff', padding:'1px 6px', borderRadius:10 }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          {children}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width:262, background:'var(--bg2)', borderLeft:'1px solid var(--bd)', flexShrink:0, overflowY:'auto', display:'flex', flexDirection:'column' }}>

          {/* Activity */}
          <div style={{ borderBottom:'1px solid var(--bd)', padding:13 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:9 }}>⚡ Live Activity</div>
            {activities.slice(0,6).map(a => (
              <div key={a.id} style={{ display:'flex', gap:7, alignItems:'flex-start', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:a.color, marginTop:5, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:11, color:'var(--tx2)', lineHeight:1.4 }}>{a.text}</div>
                  <div style={{ fontSize:9, color:'var(--tx3)', marginTop:1 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ borderBottom:'1px solid var(--bd)', padding:13 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:9 }}>📋 Timeline</div>
            {TIMELINE_ITEMS.slice(0,5).map((item,i) => (
              <div key={i} style={{ display:'flex', gap:9, padding:'6px 0' }}>
                <div style={{
                  width:17, height:17, borderRadius:'50%', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:8,
                  background: item.status==='done' ? 'rgba(34,197,94,0.18)' : item.status==='running' ? 'rgba(26,115,232,0.2)' : 'rgba(255,255,255,0.04)',
                  color: item.status==='done' ? 'var(--grn)' : item.status==='running' ? 'var(--gm2)' : 'var(--tx3)',
                }}>
                  {item.status==='done'?'✓':item.status==='running'?'◌':'○'}
                </div>
                <div>
                  <div style={{ fontSize:11, color: item.status==='done'?'var(--tx)':item.status==='running'?'var(--gm2)':'var(--tx3)' }}>{item.text}</div>
                  <div style={{ fontSize:9, color:'var(--tx3)', marginTop:1 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div style={{ padding:13 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--tx3)', textTransform:'uppercase', letterSpacing:'0.9px', marginBottom:9 }}>🧠 AI Insights</div>
            {INSIGHTS.map((ins,i) => (
              <div key={i} style={{ background:'var(--sf)', border:'1px solid var(--bd)', borderRadius:8, padding:9, marginBottom:7, display:'flex', gap:7 }}>
                <span style={{ fontSize:13 }}>{ins.icon}</span>
                <span style={{ fontSize:11, color:'var(--tx2)', lineHeight:1.5 }}>{ins.txt}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
