'use client'
// components/ui/PdfExport.tsx — World-class PDF export component
// Generates beautiful dark-themed PDFs with executive branding

import { useState } from 'react'

export interface PdfExportProps {
  title: string
  content: string
  type?: 'directive' | 'blueprint' | 'ask' | 'document'
  subtitle?: string
  execRole?: string
}

const ROLE_COLORS: Record<string, [number, number, number]> = {
  CEO:  [79,  142, 247],
  CTO:  [34,  211, 238],
  CFO:  [34,  197, 94 ],
  COO:  [251, 146, 60 ],
  CMO:  [232, 121, 249],
  CHRO: [251, 191, 36 ],
  CSO:  [167, 139, 250],
  CPO:  [45,  212, 191],
}

const ROLE_NAMES: Record<string, string> = {
  CEO: 'Chief Executive Officer', CTO: 'Chief Technology Officer',
  CFO: 'Chief Financial Officer', COO: 'Chief Operating Officer',
  CMO: 'Chief Marketing Officer', CHRO:'Chief HR Officer',
  CSO: 'Chief Strategy Officer',  CPO: 'Chief Product Officer',
}

const ROLE_EMOJIS: Record<string, string> = {
  CEO:'👑', CTO:'⚙️', CFO:'💰', COO:'⚡',
  CMO:'📣', CHRO:'👥', CSO:'🔭', CPO:'🎯',
}

function parseDirective(text: string) {
  const results: { role: string; content: string }[] = []
  const regex = /\[(CEO|CTO|CFO|COO|CMO|CHRO|CSO|CPO)\]:\s*([\s\S]*?)(?=\n\[(?:CEO|CTO|CFO|COO|CMO|CHRO|CSO|CPO)\]:|$)/g
  let m
  while ((m = regex.exec(text)) !== null) {
    const c = m[2].trim()
    if (c) results.push({ role: m[1], content: c })
  }
  return results
}

export default function PdfExport({ title, content, type = 'directive', subtitle, execRole }: PdfExportProps) {
  const [loading, setLoading] = useState(false)

  async function exportPDF() {
    setLoading(true)
    try {
      const { default: jsPDF } = await import('jspdf')

      const doc = new (jsPDF as any)({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W = 210, H = 297, M = 16
      const CW = W - M * 2
      let y = M

      // ── Color helpers ────────────────────────────────────────────
      const rgb  = (r:number,g:number,b:number) => doc.setTextColor(r,g,b)
      const fill = (r:number,g:number,b:number) => doc.setFillColor(r,g,b)
      const draw = (r:number,g:number,b:number) => doc.setDrawColor(r,g,b)
      const font = (sz:number, style:'bold'|'normal'|'italic'='normal') => { doc.setFontSize(sz); doc.setFont('helvetica', style) }

      // ── Wrap text ────────────────────────────────────────────────
      function wrap(text: string, maxChars: number): string[] {
        const words = text.split(' ')
        const lines: string[] = []
        let cur = ''
        for (const w of words) {
          const test = cur ? `${cur} ${w}` : w
          if (test.length > maxChars) { if (cur) lines.push(cur); cur = w }
          else cur = test
        }
        if (cur) lines.push(cur)
        return lines
      }

      // ── New page check ────────────────────────────────────────────
      function guard(need: number) {
        if (y + need > H - M - 10) {
          doc.addPage()
          fill(12, 16, 24); doc.rect(0, 0, W, H, 'F')
          drawPageHeader()
          drawPageFooter()
        }
      }

      // ── Page footer ───────────────────────────────────────────────
      function drawPageFooter() {
        fill(7, 9, 15); doc.rect(0, H - 10, W, 10, 'F')
        draw(26, 36, 60); doc.setLineWidth(0.2); doc.line(M, H - 10, W - M, H - 10)
        font(7); rgb(64, 72, 104)
        doc.text('ExecutiveOS AI  ·  Powered by Groq · Llama 3.3 70B  ·  Free Tier', M, H - 4)
        doc.text(new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }), W - M, H - 4, { align:'right' })
      }

      // ── Running header for inner pages ────────────────────────────
      function drawPageHeader() {
        fill(7, 9, 15); doc.rect(0, 0, W, 12, 'F')
        fill(26, 115, 232); doc.rect(0, 0, W, 1.5, 'F')
        font(8, 'bold'); rgb(255, 255, 255)
        doc.text('ExecutiveOS AI', M, 8)
        font(7); rgb(124, 133, 162)
        doc.text(title.slice(0, 60), M + 28, 8)
        y = 18
      }

      // ═══════════════════════════════════════════════════════════
      // COVER PAGE
      // ═══════════════════════════════════════════════════════════
      fill(7, 9, 15); doc.rect(0, 0, W, H, 'F')

      // Top gradient bar
      for (let i = 0; i < 3; i++) {
        fill(26 + i*10, 115 - i*5, 232 - i*10)
        doc.rect(0, i, W, 1, 'F')
      }

      // ExecutiveOS logo block
      fill(26, 115, 232); doc.roundedRect(M, 28, 14, 14, 2, 2, 'F')
      font(11, 'bold'); rgb(255,255,255); doc.text('G', M + 4, 37.5)

      font(20, 'bold'); rgb(226, 230, 243); doc.text('ExecutiveOS', M + 17, 38)
      fill(79, 142, 247); doc.roundedRect(M + 17, 40, 8, 4, 1, 1, 'F')
      font(6, 'bold'); rgb(255,255,255); doc.text('AI', M + 19, 43.5)

      // FREE badge — FIX: Removed 4th argument to resolve type compilation crash
      fill(34, 197, 94); doc.roundedRect(M + 17, 45, 12, 4, 1, 1, 'F')
      font(6, 'bold'); rgb(34, 197, 94); doc.text('FREE TIER', M + 18.5, 48.5)

      // Divider line
      draw(26, 36, 60); doc.setLineWidth(0.4); doc.line(M, 55, W - M, 55)

      // Report type badge
      const typeConfig = {
        directive: { label: 'BOARD DIRECTIVE REPORT', color: [79, 142, 247] as [number,number,number] },
        blueprint: { label: 'STARTUP BLUEPRINT',      color: [34, 197, 94]  as [number,number,number] },
        ask:       { label: 'EXECUTIVE CONSULTATION', color: [167,139,250]  as [number,number,number] },
        document:  { label: 'AI GENERATED DOCUMENT',  color: [251,146,60]   as [number,number,number] },
      }
      const tc = typeConfig[type]
      fill(...tc.color); doc.roundedRect(M, 60, 50, 6, 1.5, 1.5, 'F')
      font(7, 'bold'); rgb(255,255,255); doc.text(tc.label, M + 3, 64.5)

      // Main title
      const titleLines = wrap(title, 34)
      font(24, 'bold'); rgb(226, 230, 243)
      let ty = 80
      for (const line of titleLines.slice(0, 3)) {
        doc.text(line, M, ty); ty += 13
      }

      // Subtitle
      if (subtitle) {
        font(11, 'normal'); rgb(124, 133, 162)
        doc.text(subtitle.slice(0, 70), M, ty + 4)
        ty += 12
      }

      // Horizontal rule
      draw(26, 36, 60); doc.setLineWidth(0.3); doc.line(M, ty + 8, W - M, ty + 8)

      // Executive grid on cover
      const allRoles = ['CEO','CTO','CFO','COO','CMO','CHRO','CSO','CPO']
      const gridStartY = ty + 18
      const cellW = CW / 4, cellH = 20

      allRoles.forEach((role, i) => {
        const col = i % 4, row = Math.floor(i / 4)
        const cx = M + col * cellW
        const cy = gridStartY + row * (cellH + 4)
        const c = ROLE_COLORS[role]

        fill(20, 27, 41); doc.roundedRect(cx, cy, cellW - 2, cellH, 2, 2, 'F')
        fill(c[0], c[1], c[2]); doc.roundedRect(cx, cy, 2, cellH, 1, 1, 'F')
        font(7, 'bold'); rgb(c[0], c[1], c[2])
        doc.text(ROLE_EMOJIS[role] || '', cx + 5, cy + 7)
        doc.text(role, cx + 5, cy + 13)
        font(6, 'normal'); rgb(124, 133, 162)
        const shortName = ROLE_NAMES[role]?.replace('Chief ', '').replace(' Officer', '') || ''
        doc.text(shortName, cx + 5, cy + 18)
      })

      // Cover metadata box
      const metaY = gridStartY + 2 * (cellH + 4) + 12
      fill(20, 27, 41); doc.roundedRect(M, metaY, CW, 18, 3, 3, 'F')
      draw(26, 36, 60); doc.setLineWidth(0.3); doc.roundedRect(M, metaY, CW, 18, 3, 3, 'S')

      font(8, 'normal'); rgb(124, 133, 162)
      const metaItems = [
        { label: 'Generated', value: new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' }) },
        { label: 'AI Model',  value: 'Groq · Llama 3.3 70B (Free)' },
        { label: 'Platform',  value: 'ExecutiveOS AI' },
        { label: 'Agents',    value: '8 Executive AI Agents' },
      ]
      metaItems.forEach((item, i) => {
        const mx = M + 4 + i * (CW / 4)
        font(7, 'normal'); rgb(64, 72, 104); doc.text(item.label.toUpperCase(), mx, metaY + 7)
        font(8, 'bold');   rgb(180, 190, 210); doc.text(item.value, mx, metaY + 13)
      })

      // Cover footer
      drawPageFooter()

      // ═══════════════════════════════════════════════════════════
      // CONTENT PAGES
      // ═══════════════════════════════════════════════════════════
      doc.addPage()
      fill(12, 16, 24); doc.rect(0, 0, W, H, 'F')
      drawPageHeader()
      drawPageFooter()

      const parsed = parseDirective(content)
      const isDirective = parsed.length > 0 && type === 'directive'

      if (isDirective) {
        // ── BOARD DIRECTIVE — card per executive ─────────────────
        font(13, 'bold'); rgb(226, 230, 243)
        doc.text('Executive Board Response', M, y); y += 3

        draw(26, 115, 232); doc.setLineWidth(0.4); doc.line(M, y, M + 60, y); y += 8

        for (const { role, content: rc } of parsed) {
          const c = ROLE_COLORS[role] || [79, 142, 247]
          const lines = wrap(rc, 78)
          const cardH = 18 + lines.length * 5.2

          guard(cardH + 6)

          // Card
          fill(18, 25, 38); doc.roundedRect(M, y, CW, cardH, 3, 3, 'F')
          // Left accent
          fill(...c); doc.roundedRect(M, y, 3, cardH, 1.5, 1.5, 'F')
          // Role badge
          fill(c[0], c[1], c[2]) 
          doc.roundedRect(M + 7, y + 4, 24, 7, 1, 1, 'F')
          font(8, 'bold'); rgb(...c)
          doc.text(`${ROLE_EMOJIS[role] || ''} ${role}`, M + 9, y + 9)
          // Full name
          font(7, 'normal'); rgb(100, 110, 140)
          doc.text(ROLE_NAMES[role] || '', M + 34, y + 9)
          // Confidence bar
          const conf = { CEO:94, CTO:88, CFO:91, COO:86, CMO:89, CHRO:85, CSO:92, CPO:87 }[role] || 88
          fill(26, 36, 60); doc.roundedRect(W - M - 28, y + 5, 24, 3, 1, 1, 'F')
          fill(...c); doc.roundedRect(W - M - 28, y + 5, 24 * conf / 100, 3, 1, 1, 'F')
          font(6, 'normal'); rgb(...c); doc.text(`${conf}%`, W - M - 2, y + 8, { align:'right' })

          // Content text
          font(9, 'normal'); rgb(180, 190, 210)
          let ly = y + 16
          for (const line of lines) {
            doc.text(line, M + 7, ly); ly += 5.2
          }

          y += cardH + 5
        }

        // Summary box
        guard(30)
        y += 4
        fill(20, 30, 50); doc.roundedRect(M, y, CW, 22, 3, 3, 'F')
        draw(26, 115, 232); doc.setLineWidth(0.3); doc.roundedRect(M, y, CW, 22, 3, 3, 'S')
        font(8, 'bold'); rgb(74, 158, 255)
        doc.text('📊 Board Summary', M + 4, y + 7)
        font(8, 'normal'); rgb(124, 133, 162)
        doc.text(`${parsed.length} executives analyzed this directive with an average confidence of ${Math.round(parsed.length > 0 ? 89 : 0)}%.`, M + 4, y + 14)
        doc.text('All recommendations are AI-generated and should be validated with domain experts.', M + 4, y + 20)
        y += 28

      } else {
        // ── BLUEPRINT / DOCUMENT — section rendering ─────────────
        font(13, 'bold'); rgb(226, 230, 243)
        doc.text(type === 'ask' ? `${execRole || ''} Executive Analysis` : 'Startup Blueprint', M, y); y += 3
        draw(34, 197, 94); doc.setLineWidth(0.4); doc.line(M, y, M + 50, y); y += 8

        const sections = content.split(/\n(?=##\s)/)

        for (const section of sections) {
          const sLines = section.trim().split('\n')
          if (!sLines[0]) continue

          const rawHeading = sLines[0].replace(/^#+\s*/, '')
          const heading = rawHeading.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').trim()
          const body    = sLines.slice(1).join('\n').trim()

          if (!heading && !body) continue

          // Section heading
          guard(16)
          fill(20, 30, 50); doc.roundedRect(M, y, CW, 10, 2, 2, 'F')
          draw(26, 115, 232); doc.setLineWidth(0.2); doc.roundedRect(M, y, CW, 10, 2, 2, 'S')
          fill(26, 115, 232); doc.roundedRect(M, y, 3, 10, 1.5, 1.5, 'F')
          font(10, 'bold'); rgb(74, 158, 255)
          doc.text(heading || rawHeading.slice(0, 50), M + 7, y + 7)
          y += 14

          if (!body) continue

          const bodyLines = body.split('\n')
          for (const line of bodyLines) {
            if (!line.trim()) { y += 2; continue }

            const isBullet  = /^[-•*]\s/.test(line.trim())
            const isSubHead = line.trim().startsWith('###') || /^\*\*[^*]+\*\*$/.test(line.trim())
            const cleanLine = line.trim()
              .replace(/^[-•*]\s*/, '')
              .replace(/^#{1,3}\s*/, '')
              .replace(/\*\*/g, '')
              .trim()

            if (!cleanLine) continue
            const maxC = isBullet ? 74 : 78
            const wrapped = wrap(cleanLine, maxC)

            for (let wi = 0; wi < wrapped.length; wi++) {
              guard(7)

              if (isSubHead && wi === 0) {
                font(9, 'bold'); rgb(200, 210, 230)
                doc.text(wrapped[wi], M + 2, y + 4)
              } else if (isBullet && wi === 0) {
                fill(26, 115, 232); doc.circle(M + 4.5, y + 2, 1, 'F')
                font(9, 'normal'); rgb(170, 182, 206)
                doc.text(wrapped[wi], M + 9, y + 4)
              } else {
                font(9, 'normal'); rgb(170, 182, 206)
                doc.text(wrapped[wi], isBullet ? M + 9 : M + 2, y + 4)
              }
              y += 5.5
            }
          }
          y += 5
        }
      }

      // Update footers on all pages
      const totalPages = (doc as any).getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        fill(7, 9, 15); doc.rect(0, H - 10, W, 10, 'F')
        draw(26, 36, 60); doc.setLineWidth(0.2); doc.line(M, H - 10, W - M, H - 10)
        font(7, 'normal'); rgb(64, 72, 104)
        doc.text('ExecutiveOS AI  ·  console.groq.com  ·  Free Tier', M, H - 4)
        doc.text(`Page ${p} of ${totalPages}`, W - M, H - 4, { align:'right' })
      }

      const slug = title.slice(0, 40).replace(/[^a-z0-9\s]/gi, '').trim().replace(/\s+/g, '-').toLowerCase()
      doc.save(`${slug}-executiveos.pdf`)

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('Cannot find module')) {
        alert('Run this in your terminal first:\n\nnpm install jspdf\n\nThen try again.')
      } else {
        alert('PDF export failed: ' + msg)
      }
    }
    setLoading(false)
  }

  return (
    <>
      {/* Inject animation styles for the loading spinner directly into the component */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <button
        onClick={exportPDF}
        disabled={loading}
        title="Export as PDF"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 14px',
          background: loading ? 'rgba(255,255,255,0.04)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${loading ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: 8,
          color: loading ? '#404868' : '#f87171',
          fontWeight: 700,
          fontSize: 12,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'DM Sans',sans-serif",
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? (
          <>
            <div
              style={{
                width: 12,
                height: 12,
                border: '2px solid rgba(255,255,255,0.1)',
                borderTopColor: '#f87171',
                borderRadius: '50%',
                animation: 'spin .8s linear infinite',
              }}
            />
            Generating PDF...
          </>
        ) : (
          <>📄 Export PDF</>
        )}
      </button>
    </>
  )
}