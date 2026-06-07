'use client'
// app/gitlab/page.tsx — GitLab MCP Workspace

import { useState } from 'react'
import { useStore } from '@/lib/store'

const MOCK_REPOS = [
  { name: 'smartcart-backend',  lang: 'Node.js',  milestones: 3, issues: 18, pushed: '2h ago',  status: 'Active',      color: '#22c55e' },
  { name: 'smartcart-frontend', lang: 'Next.js',  milestones: 2, issues: 9,  pushed: '45m ago', status: 'In Progress', color: '#4a9eff' },
  { name: 'smartcart-ml-engine',lang: 'Python',   milestones: 1, issues: 4,  pushed: '1d ago',  status: 'Review',      color: '#f59e0b' },
]

const INITIAL_ISSUES = [
  { id: '#42', title: 'Implement JWT auth with refresh tokens',            pri: 'High',   c: '#ef4444', sprint: 1 },
  { id: '#43', title: 'Design PostgreSQL schema for orders & products',    pri: 'High',   c: '#ef4444', sprint: 1 },
  { id: '#44', title: 'Set up CI/CD pipeline with GitLab Actions',        pri: 'Medium', c: '#f59e0b', sprint: 1 },
  { id: '#45', title: 'Build product catalog search with Elasticsearch',   pri: 'Medium', c: '#f59e0b', sprint: 2 },
  { id: '#46', title: 'Integrate Razorpay payment gateway',               pri: 'Sprint 2',c: '#4a9eff', sprint: 2 },
  { id: '#47', title: 'Build real-time order tracking with WebSockets',   pri: 'Sprint 2',c: '#4a9eff', sprint: 2 },
]

const MILESTONES = [
  { title: 'MVP Foundation',  due: 'Jun 14, 2026', pct: 65, open: 8,  closed: 14 },
  { title: 'MVP Complete',    due: 'Jun 28, 2026', pct: 12, open: 16, closed: 2  },
  { title: 'Beta Launch',     due: 'Jul 26, 2026', pct: 0,  open: 0,  closed: 0  },
  { title: 'v1.0 Launch',     due: 'Aug 23, 2026', pct: 0,  open: 0,  closed: 0  },
]

export default function GitLabPage() {
  const { addActivity } = useStore()
  const [issues, setIssues] = useState(INITIAL_ISSUES)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newLabel, setNewLabel] = useState('High')
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupResult, setSetupResult] = useState('')
  const [activeTab, setActiveTab] = useState<'issues' | 'milestones' | 'mrs'>('issues')

  function addIssue() {
    if (!newTitle.trim()) return
    const newIssue = {
      id: `#${50 + issues.length}`,
      title: newTitle,
      pri: newLabel,
      c: newLabel === 'High' ? '#ef4444' : newLabel === 'Medium' ? '#f59e0b' : '#4a9eff',
      sprint: 2,
    }
    setIssues(prev => [newIssue, ...prev])
    addActivity({ color: '#22d3ee', text: `CTO created issue: ${newTitle.slice(0, 40)}`, time: 'Just now' })
    setNewTitle(''); setCreating(false)
  }

  async function setupWorkspace() {
    setSetupLoading(true)
    setSetupResult('')
    try {
      const res = await fetch('/api/gitlab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cto_setup_workspace', startupName: 'SmartCart', description: 'AI grocery delivery startup' }),
      })
      const data = await res.json()
      if (data.success) {
        setSetupResult(`✅ GitLab workspace created! Project: ${data.data?.project?.web_url || 'Created'}`)
        addActivity({ color: '#22d3ee', text: 'CTO Agent set up full GitLab workspace', time: 'Just now' })
      } else {
        setSetupResult(`⚠ ${data.error} — Check GITLAB_TOKEN in .env.local`)
      }
    } catch (e) {
      setSetupResult('⚠ Add GITLAB_TOKEN to .env.local to enable live integration')
    }
    setSetupLoading(false)
  }

  const tabStyle = (t: string) => ({
    padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: activeTab === t ? 'rgba(26,115,232,0.15)' : 'transparent',
    color: activeTab === t ? '#4a9eff' : '#7c85a2',
    border: activeTab === t ? '1px solid rgba(26,115,232,0.3)' : '1px solid transparent',
    fontFamily: 'DM Sans',
  })

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>🦊 GitLab Workspace</h1>
        <p style={{ color: '#7c85a2', fontSize: 12, marginTop: 3 }}>
          CTO Agent manages repos, milestones, issues & merge requests via GitLab MCP
        </p>
      </div>

      <div style={{ padding: '18px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Actions Row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setCreating(true)}
            style={{ padding: '8px 14px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            + Create Issue
          </button>
          <button onClick={setupWorkspace} disabled={setupLoading}
            style={{ padding: '8px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#7c85a2', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            {setupLoading ? '⟳ Setting up...' : '⚙️ CTO: Setup Full Workspace'}
          </button>
          <button style={{ padding: '8px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#7c85a2', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
            🔀 Review MRs (3)
          </button>
          {setupResult && (
            <div style={{ fontSize: 12, color: setupResult.startsWith('✅') ? '#22c55e' : '#f59e0b', flex: 1 }}>
              {setupResult}
            </div>
          )}
        </div>

        {/* Create Issue Form */}
        {creating && (
          <div style={{ background: '#141b29', border: '1px solid rgba(26,115,232,0.3)', borderRadius: 12, padding: 14, animation: 'slideIn 0.25s ease' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4a9eff', marginBottom: 10 }}>⚙️ CTO Agent — New Issue</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addIssue()}
                placeholder="Issue title..."
                style={{ flex: 1, background: '#111622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e2e6f3', fontSize: 13, fontFamily: 'DM Sans', outline: 'none' }} />
              <select value={newLabel} onChange={e => setNewLabel(e.target.value)}
                style={{ background: '#111622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 12px', color: '#e2e6f3', fontSize: 12, fontFamily: 'DM Sans', outline: 'none' }}>
                <option>High</option><option>Medium</option><option>Sprint 2</option><option>Sprint 3</option>
              </select>
              <button onClick={addIssue}
                style={{ padding: '8px 14px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                Create
              </button>
              <button onClick={() => setCreating(false)}
                style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#7c85a2', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Repositories */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Active Repositories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOCK_REPOS.map(repo => (
              <div key={repo.name} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.1s' }}>
                <span style={{ fontSize: 16 }}>📦</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#4a9eff' }}>{repo.name}</div>
                  <div style={{ fontSize: 10, color: '#404868', marginTop: 2 }}>{repo.lang} · {repo.milestones} milestones · {repo.issues} issues · pushed {repo.pushed}</div>
                </div>
                <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: `${repo.color}20`, color: repo.color }}>{repo.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            <button style={tabStyle('issues')} onClick={() => setActiveTab('issues')}>Issues ({issues.length})</button>
            <button style={tabStyle('milestones')} onClick={() => setActiveTab('milestones')}>Milestones</button>
            <button style={tabStyle('mrs')} onClick={() => setActiveTab('mrs')}>Merge Requests (3)</button>
          </div>

          {/* Issues Tab */}
          {activeTab === 'issues' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {issues.map(issue => (
                <div key={issue.id} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10, animation: 'slideIn 0.25s ease' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#404868', flexShrink: 0 }}>{issue.id}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{issue.title}</div>
                    <div style={{ fontSize: 10, color: '#404868', marginTop: 2 }}>CTO Agent · smartcart-backend · Sprint {issue.sprint}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: `${issue.c}20`, color: issue.c }}>{issue.pri}</span>
                </div>
              ))}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MILESTONES.map(m => (
                <div key={m.title} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{m.title}</div>
                    <div style={{ fontSize: 10, color: '#404868' }}>Due {m.due}</div>
                  </div>
                  <div style={{ background: '#111622', borderRadius: 4, height: 4, marginBottom: 6 }}>
                    <div style={{ width: `${m.pct}%`, height: '100%', background: '#4a9eff', borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#404868' }}>{m.pct}% · {m.open} open · {m.closed} closed</div>
                </div>
              ))}
            </div>
          )}

          {/* MRs Tab */}
          {activeTab === 'mrs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: '!12', title: 'feat: Add JWT authentication middleware', author: 'CTO Agent', branch: 'feature/auth → main', status: 'Open', color: '#22c55e' },
                { id: '!11', title: 'chore: Set up CI/CD pipeline', author: 'CTO Agent', branch: 'feature/cicd → main', status: 'Review', color: '#f59e0b' },
                { id: '!10', title: 'feat: Database schema migration v1', author: 'CTO Agent', branch: 'feature/schema → main', status: 'Merged', color: '#a78bfa' },
              ].map(mr => (
                <div key={mr.id} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#404868' }}>{mr.id}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{mr.title}</div>
                    <div style={{ fontSize: 10, color: '#404868', marginTop: 2 }}>{mr.author} · {mr.branch}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 20, fontWeight: 700, background: `${mr.color}20`, color: mr.color }}>{mr.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
