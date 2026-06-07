'use client'
// app/analytics/page.tsx — Analytics Center

import { useEffect, useRef } from 'react'

const METRICS = [
  { label: 'ARR',      value: '$3.4M', change: '↑ 34% YoY',    up: true,  color: '#22c55e' },
  { label: 'CAC',      value: '$124',  change: '↓ 8% (better)', up: true,  color: '#22d3ee' },
  { label: 'LTV',      value: '$890',  change: '↑ 12%',         up: true,  color: '#4a9eff' },
  { label: 'LTV:CAC',  value: '7.2x',  change: '↑ Best-in-class',up: true, color: '#a78bfa' },
  { label: 'NPS',      value: '72',    change: 'World-class',    up: true,  color: '#e879f9' },
  { label: 'Churn',    value: '1.8%',  change: '↓ 0.4% mo',     up: true,  color: '#f59e0b' },
  { label: 'MRR',      value: '$284K', change: '↑ 18.4%',       up: true,  color: '#2dd4bf' },
  { label: 'Runway',   value: '14mo',  change: 'On track',       up: true,  color: '#fb923c' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const CHARTS = [
  {
    title: '📈 Monthly Revenue ($K)',
    values: [82, 105, 128, 154, 218, 284],
    color: '#4a9eff',
    format: (v: number) => `$${v}K`,
  },
  {
    title: '👥 Team Headcount',
    values: [12, 14, 15, 18, 21, 23],
    color: '#22c55e',
    format: (v: number) => `${v}`,
  },
  {
    title: '⚡ Engineering Velocity (pts)',
    values: [62, 70, 75, 82, 89, 94],
    color: '#22d3ee',
    format: (v: number) => `${v}pts`,
  },
  {
    title: '🎯 Marketing Leads',
    values: [320, 480, 620, 800, 1100, 1420],
    color: '#e879f9',
    format: (v: number) => `${v}`,
  },
  {
    title: '💰 Burn Rate ($K/mo)',
    values: [145, 138, 152, 160, 148, 141],
    color: '#f59e0b',
    format: (v: number) => `$${v}K`,
  },
  {
    title: '📦 Orders / Month',
    values: [0, 120, 380, 820, 1640, 2900],
    color: '#fb923c',
    format: (v: number) => `${v}`,
  },
]

const RISK_ITEMS = [
  { label: 'Burn Rate vs Runway', value: 72, color: '#f59e0b', status: 'Moderate' },
  { label: 'Competitor Threat',   value: 45, color: '#22c55e', status: 'Low'      },
  { label: 'Tech Debt',           value: 31, color: '#22c55e', status: 'Low'      },
  { label: 'Hiring Risk',         value: 58, color: '#f59e0b', status: 'Moderate' },
  { label: 'Market Timing',       value: 22, color: '#22c55e', status: 'Low'      },
  { label: 'Regulatory',          value: 15, color: '#22c55e', status: 'Low'      },
]

function BarChart({ values, color, format }: { values: number[]; color: string; format: (v: number) => string }) {
  const max = Math.max(...values)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
        {values.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 9, color: '#404868' }}>{format(v)}</span>
            <div style={{
              width: '100%',
              height: `${Math.round((v / max) * 65) + 5}px`,
              background: color,
              borderRadius: '3px 3px 0 0',
              opacity: 0.8,
              transition: 'height 0.8s ease',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {MONTHS.map(m => (
          <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#404868' }}>{m}</div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Analytics Center</h1>
        <p style={{ color: '#7c85a2', fontSize: 12, marginTop: 3 }}>
          Real-time business intelligence across all departments · CFO & COO reporting
        </p>
      </div>

      <div style={{ padding: '18px 24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* KPI Metrics */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Key Metrics</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {METRICS.map(m => (
              <div key={m.label} style={{
                background: '#141b29', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: 14, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: m.color }} />
                <div style={{ fontSize: 10, color: '#7c85a2', marginBottom: 5 }}>{m.label}</div>
                <div style={{ fontFamily: 'Syne', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>{m.value}</div>
                <div style={{ fontSize: 10, color: m.up ? '#22c55e' : '#ef4444', marginTop: 3 }}>{m.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Performance Charts</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {CHARTS.map(chart => (
              <div key={chart.title} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#7c85a2', marginBottom: 12 }}>{chart.title}</div>
                <BarChart values={chart.values} color={chart.color} format={chart.format} />
              </div>
            ))}
          </div>
        </div>

        {/* Risk Radar */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>⚠ Risk Indicators (CSO & CFO)</div>
          <div style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RISK_ITEMS.map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 140, fontSize: 12, color: '#7c85a2', flexShrink: 0 }}>{r.label}</div>
                  <div style={{ flex: 1, background: '#111622', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${r.value}%`, height: '100%', background: r.color, borderRadius: 4, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ width: 60, fontSize: 10, fontWeight: 700, color: r.color, textAlign: 'right' }}>{r.status}</div>
                  <div style={{ width: 30, fontSize: 10, color: '#404868', textAlign: 'right' }}>{r.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Scorecards */}
        <div>
          <div style={{ fontFamily: 'Syne', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Department Scorecards</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {[
              { dept: 'Engineering', emoji: '⚙️', score: 94, items: ['Velocity: 94pts', 'Bugs: 3 open', 'Deploy freq: 4/wk', 'Lead time: 2.1d'] },
              { dept: 'Marketing',   emoji: '📣', score: 82, items: ['Leads: 1,420/mo', 'MQL→SQL: 24%', 'CPL: $31', 'Content: 12 posts'] },
              { dept: 'Finance',     emoji: '💰', score: 88, items: ['MRR: $284K', 'Burn: $141K', 'Runway: 14mo', 'P&L: -$143K'] },
              { dept: 'People',      emoji: '👥', score: 79, items: ['Team: 23', 'eNPS: 68', 'Attrition: 4%', 'Open roles: 5'] },
            ].map(d => (
              <div key={d.dept} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{d.emoji}</span>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{d.dept}</div>
                  <div style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                    color: d.score >= 85 ? '#22c55e' : d.score >= 70 ? '#f59e0b' : '#ef4444',
                  }}>{d.score}/100</div>
                </div>
                <div style={{ background: '#111622', borderRadius: 4, height: 4, marginBottom: 10 }}>
                  <div style={{ width: `${d.score}%`, height: '100%', background: d.score >= 85 ? '#22c55e' : '#f59e0b', borderRadius: 4 }} />
                </div>
                {d.items.map(item => (
                  <div key={item} style={{ fontSize: 10, color: '#7c85a2', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
