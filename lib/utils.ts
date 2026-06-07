import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ExecutiveRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const EXEC_COLORS: Record<ExecutiveRole, { color: string; bg: string }> = {
  CEO:  { color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)'  },
  CTO:  { color: '#22d3ee', bg: 'rgba(34,211,238,0.15)'  },
  CFO:  { color: '#22c55e', bg: 'rgba(34,197,94,0.15)'   },
  COO:  { color: '#fb923c', bg: 'rgba(251,146,60,0.15)'  },
  CMO:  { color: '#e879f9', bg: 'rgba(232,121,249,0.15)' },
  CHRO: { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)'  },
  CSO:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  CPO:  { color: '#2dd4bf', bg: 'rgba(45,212,191,0.15)'  },
}

export function parseGeminiDirectiveResponse(text: string): { role: string; content: string }[] {
  const results: { role: string; content: string }[] = []
  const roleRegex = /\[(CEO|CTO|CFO|COO|CMO|CHRO|CSO|CPO)\]:\s*([\s\S]*?)(?=\n\[(?:CEO|CTO|CFO|COO|CMO|CHRO|CSO|CPO)\]:|$)/g
  let match
  while ((match = roleRegex.exec(text)) !== null) {
    const content = match[2].trim()
    if (content) results.push({ role: match[1], content })
  }
  return results
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
