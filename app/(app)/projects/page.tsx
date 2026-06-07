'use client'
// app/projects/page.tsx — Projects Dashboard

import { useState } from 'react'
import { useStore } from '@/lib/store'

const PROJECTS = [
  {
    id: 'p1', name: 'SmartCart MVP Launch', emoji: '🛒',
    desc: 'Full product launch including backend, frontend, ML engine, and operations',
    owner: 'CEO', execs: ['CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CPO'],
    status: 'on-track', progress: 62, done: 18, total: 29,
    due: 'Aug 2026', color: '#4a9eff',
    milestones: [
      { name: 'MVP Foundation', pct: 100, status: 'done'    },
      { name: 'MVP Complete',   pct: 48,  status: 'active'  },
      { name: 'Beta Launch',    pct: 0,   status: 'pending' },
      { name: 'v1.0 Launch',   pct: 0,   status: 'pending' },
    ],
    team: ['Backend Eng (2)', 'Frontend Eng (1)', 'ML Eng (1)', 'Designer (1)', 'PM (1)'],
  },
  {
    id: 'p2', name: 'India Market Expansion', emoji: '🇮🇳',
    desc: 'Strategic expansion into Mumbai, Bangalore, and Delhi NCR markets',
    owner: 'CSO', execs: ['CSO', 'CMO', 'COO', 'CFO'],
    status: 'planning', progress: 28, done: 7, total: 25,
    due: 'Q4 2026', color: '#f59e0b',
    milestones: [
      { name: 'Market Research', pct: 100, status: 'done'    },
      { name: 'Partnership Setup',pct: 35,  status: 'active'  },
      { name: 'Soft Launch',      pct: 0,   status: 'pending' },
      { name: 'Full Launch',      pct: 0,   status: 'pending' },
    ],
    team: ['City Manager (1)', 'Biz Dev (1)', 'Ops Manager (1)'],
  },
  {
    id: 'p3', name: 'Series A Fundraise', emoji: '💡',
    desc: '$5M Series A round to fuel expansion and engineering team growth',
    owner: 'CFO', execs: ['CFO', 'CEO', 'CSO'],
    status: 'active', progress: 45, done: 14, total: 31,
    due: 'Sep 2026', color: '#22d3ee',
    milestones: [
      { name: 'Deck & Materials', pct: 100, status: 'done'   },
      { name: 'Investor Outreach',pct: 60,  status: 'active' },
      { name: 'Term Sheets',      pct: 0,   status: 'pending'},
      { name: 'Close',            pct: 0,   status: 'pending'},
    ],
    team: ['CEO', 'CFO', 'Legal Counsel (1)'],
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  'on-track': { label: 'On Track', color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  'planning':  { label: 'Planning', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'active':    { label: 'Active',   color: '#4a9eff', bg: 'rgba(74,158,255,0.12)' },
  'at-risk':   { label: 'At Risk',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
}

export default function ProjectsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const { geminiKey, addActivity } = useStore()
  const [advice, setAdvice] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)

  async function getProjectAdvice(project: typeof PROJECTS[0]) {
    if (!geminiKey) { alert('Add Gemini key in Settings'); return }
    setLoading(project.id)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask_executive',
          role: project.owner,
          question: `What should be our top 3 priorities for "${project.name}" in the next 2 weeks? Current progress: ${project.progress}%, ${project.done} tasks done, ${project.total - project.done} remaining. Due: ${project.due}.`,
          apiKey: geminiKey,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAdvice(prev => ({ ...prev, [project.id]: data.result }))
        addActivity({ color: project.color, text: `${project.owner} gave advice on ${project.name}`, time: 'Just now' })
      }
    } catch (e) { /* silent */ }
    setLoading(null)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Projects</h1>
        <p style={{ color: '#7c85a2', fontSize: 12, marginTop: 3 }}>
          Active company initiatives managed by the executive board
        </p>
      </div>

      <div style={{ padding: '18px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PROJECTS.map(proj => {
          const s = STATUS_CONFIG[proj.status]
          const isExpanded = selected === proj.id
          return (
            <div key={proj.id} style={{ background: '#141b29', border: `1px solid ${isExpanded ? proj.color + '40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>

              {/* Project Header */}
              <div
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}
                onClick={() => setSelected(isExpanded ? null : proj.id)}
              >
                <span style={{ fontSize: 20, marginTop: 1 }}>{proj.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{proj.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, padding: '2px 8px', borderRadius: 20 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#7c85a2', marginBottom: 8 }}>{proj.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: '#404868' }}>Owner: {proj.owner}</span>
                    <span style={{ fontSize: 10, color: '#404868' }}>{proj.execs.join(' · ')}</span>
                    <span style={{ fontSize: 10, color: '#404868' }}>Due: {proj.due}</span>
                    <span style={{ fontSize: 10, color: '#404868' }}>{proj.done}/{proj.total} tasks</span>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, background: '#111622', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                      <div style={{ width: `${proj.progress}%`, height: '100%', background: proj.color, borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: proj.color, flexShrink: 0 }}>{proj.progress}%</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#404868', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</div>
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '14px 16px', animation: 'slideIn 0.2s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

                    {/* Milestones */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#404868', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 10 }}>Milestones</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {proj.milestones.map(m => (
                          <div key={m.name} style={{ background: '#111622', borderRadius: 8, padding: '8px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                              <span style={{ fontSize: 11, fontWeight: 500 }}>{m.name}</span>
                              <span style={{ fontSize: 10, color: m.status === 'done' ? '#22c55e' : m.status === 'active' ? '#4a9eff' : '#404868' }}>
                                {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : '○'}
                              </span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 3 }}>
                              <div style={{ width: `${m.pct}%`, height: '100%', background: m.status === 'done' ? '#22c55e' : proj.color, borderRadius: 3 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Team */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#404868', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 10 }}>Team Resources</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {proj.team.map(t => (
                          <div key={t} style={{ background: '#111622', borderRadius: 7, padding: '7px 10px', fontSize: 11, color: '#7c85a2', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: proj.color, flexShrink: 0 }} />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Advice */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#404868', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 10 }}>
                        {proj.owner} Agent Advice
                      </div>
                      {advice[proj.id] ? (
                        <div style={{ fontSize: 11, lineHeight: 1.7, color: '#7c85a2', background: '#111622', borderRadius: 8, padding: 10, whiteSpace: 'pre-wrap' }}>
                          {advice[proj.id]}
                        </div>
                      ) : (
                        <button
                          onClick={() => getProjectAdvice(proj)}
                          disabled={loading === proj.id}
                          style={{
                            width: '100%', padding: '10px', background: `${proj.color}15`,
                            border: `1px solid ${proj.color}30`, borderRadius: 8,
                            color: proj.color, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}>
                          {loading === proj.id ? '⟳ Thinking...' : `🧠 Get ${proj.owner} Advice`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Add Project */}
        <div style={{ background: '#141b29', border: '2px dashed rgba(255,255,255,0.07)', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#404868', gap: 8, fontSize: 13 }}
          onClick={() => alert('Project creation wizard — coming soon! Use Startup Builder to auto-generate projects.')}>
          + Add New Project
        </div>
      </div>
    </div>
  )
}
