// types/index.ts — ExecutiveOS AI Global Types

export type ExecutiveRole = 'CEO' | 'CTO' | 'CFO' | 'COO' | 'CMO' | 'CHRO' | 'CSO' | 'CPO'

export interface Executive {
  role: ExecutiveRole
  name: string
  emoji: string
  color: string
  bg: string
  description: string
  responsibilities: string[]
  status: 'active' | 'thinking' | 'idle'
  currentTask: string
  confidence: number
}

export interface BoardDirective {
  id: string
  input: string
  responses: ExecutiveResponse[]
  createdAt: Date
  status: 'running' | 'complete' | 'error'
}

export interface ExecutiveResponse {
  role: ExecutiveRole
  content: string
  timestamp: Date
}

export interface GitLabRepo {
  id: number
  name: string
  description: string
  web_url: string
  namespace: { name: string }
  open_issues_count: number
  visibility: string
}

export interface GitLabIssue {
  id: number
  iid: number
  title: string
  description: string
  state: 'opened' | 'closed'
  labels: string[]
  assignees: { name: string; username: string }[]
  created_at: string
  web_url: string
}

export interface GitLabMilestone {
  id: number
  iid: number
  title: string
  description: string
  state: string
  due_date: string
  web_url: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'on-track' | 'at-risk' | 'planning' | 'complete'
  progress: number
  owner: ExecutiveRole
  activeExecs: ExecutiveRole[]
  tasksTotal: number
  tasksDone: number
  dueDate: string
  gitlabProjectId?: number
}

export interface Task {
  id: string
  title: string
  assignee: ExecutiveRole
  project: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'review' | 'done'
  createdAt: Date
}

export interface StartupBlueprint {
  idea: string
  problem: string
  market: string
  businessModel: string
  techArchitecture: string
  mvpFeatures: string[]
  gtmStrategy: string
  hiringPlan: string
  financialProjections: string
  risks: string[]
  gitlabWorkspace?: string
}

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export interface ActivityItem {
  id: string
  color: string
  text: string
  time: string
  execRole?: ExecutiveRole
}
