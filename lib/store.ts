'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ExecutiveRole, ActivityItem, Task } from '@/types'

interface AppState {
  geminiKey: string
  setGeminiKey: (key: string) => void
  activities: ActivityItem[]
  addActivity: (item: Omit<ActivityItem, 'id'>) => void
  tasks: Task[]
  addTask: (t: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  directiveResult: string
  directiveLoading: boolean
  setDirectiveResult: (r: string) => void
  setDirectiveLoading: (v: boolean) => void
  askResult: string
  askLoading: boolean
  setAskResult: (r: string) => void
  setAskLoading: (v: boolean) => void
  builderResult: string
  builderLoading: boolean
  setBuilderResult: (r: string) => void
  setBuilderLoading: (v: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      geminiKey: '',
      setGeminiKey: (key) => set({ geminiKey: key }),

      activities: [
        { id: '1', color: '#22d3ee', text: 'CTO created smartcart-backend in GitLab', time: '2m ago' },
        { id: '2', color: '#22c55e', text: 'CFO generated 18-month projection',        time: '5m ago' },
        { id: '3', color: '#4f8ef7', text: 'CEO approved market entry strategy',       time: '8m ago' },
        { id: '4', color: '#e879f9', text: 'CMO drafted India GTM playbook',           time: '12m ago' },
      ],
      addActivity: (item) =>
        set((s) => ({
          activities: [{ ...item, id: Math.random().toString(36).slice(2) }, ...s.activities].slice(0, 20),
        })),

      tasks: [
        { id: 't1', title: 'Define MVP feature scope',          assignee: 'CTO',  project: 'SmartCart', priority: 'high',   status: 'done',        createdAt: new Date() },
        { id: 't2', title: 'Create GitLab milestones Sprint 1', assignee: 'CTO',  project: 'SmartCart', priority: 'high',   status: 'in-progress', createdAt: new Date() },
        { id: 't3', title: 'Build 12-month financial model',    assignee: 'CFO',  project: 'SmartCart', priority: 'high',   status: 'review',      createdAt: new Date() },
        { id: 't4', title: 'Draft GTM strategy for India',      assignee: 'CMO',  project: 'India',     priority: 'medium', status: 'todo',        createdAt: new Date() },
        { id: 't5', title: 'Write Series A pitch narrative',    assignee: 'CEO',  project: 'Fundraise', priority: 'high',   status: 'in-progress', createdAt: new Date() },
      ],
      addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
      updateTask: (id, updates) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),

      directiveResult: '', directiveLoading: false,
      setDirectiveResult: (r) => set({ directiveResult: r }),
      setDirectiveLoading: (v) => set({ directiveLoading: v }),

      askResult: '', askLoading: false,
      setAskResult: (r) => set({ askResult: r }),
      setAskLoading: (v) => set({ askLoading: v }),

      builderResult: '', builderLoading: false,
      setBuilderResult: (r) => set({ builderResult: r }),
      setBuilderLoading: (v) => set({ builderLoading: v }),
    }),
    {
      name: 'executiveos-storage',
      partialize: (state) => ({ geminiKey: state.geminiKey }),
    }
  )
)
