// lib/gitlab.ts — GitLab MCP Integration

const GITLAB_BASE = process.env.GITLAB_URL || 'https://gitlab.com'
const TOKEN = process.env.GITLAB_TOKEN || ''

const glHeaders = () => ({
  'PRIVATE-TOKEN': TOKEN,
  'Content-Type': 'application/json',
})

async function glFetch(path: string, opts: RequestInit = {}) {
  const url = `${GITLAB_BASE}/api/v4${path}`
  const res = await fetch(url, { ...opts, headers: { ...glHeaders(), ...(opts.headers || {}) } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitLab API error ${res.status} on ${path}`)
  }
  return res.json()
}

// ── Projects ─────────────────────────────────────────────────
export async function createProject(name: string, description: string, visibility: 'private' | 'internal' | 'public' = 'private') {
  return glFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description, visibility, initialize_with_readme: true }),
  })
}

export async function listProjects(search?: string) {
  const q = search ? `&search=${encodeURIComponent(search)}` : ''
  return glFetch(`/projects?membership=true&per_page=20${q}`)
}

export async function getProject(projectId: number | string) {
  return glFetch(`/projects/${projectId}`)
}

// ── Milestones ────────────────────────────────────────────────
export async function createMilestone(projectId: number, title: string, description: string, dueDate?: string) {
  return glFetch(`/projects/${projectId}/milestones`, {
    method: 'POST',
    body: JSON.stringify({ title, description, due_date: dueDate }),
  })
}

export async function listMilestones(projectId: number) {
  return glFetch(`/projects/${projectId}/milestones?state=active`)
}

// ── Issues ────────────────────────────────────────────────────
export async function createIssue(
  projectId: number,
  title: string,
  description: string,
  labels?: string[],
  milestoneId?: number,
  weight?: number
) {
  return glFetch(`/projects/${projectId}/issues`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      labels: labels?.join(','),
      milestone_id: milestoneId,
      weight,
    }),
  })
}

export async function listIssues(projectId: number, state: 'opened' | 'closed' | 'all' = 'opened') {
  return glFetch(`/projects/${projectId}/issues?state=${state}&per_page=30`)
}

export async function updateIssue(projectId: number, issueIid: number, updates: Record<string, unknown>) {
  return glFetch(`/projects/${projectId}/issues/${issueIid}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// ── Merge Requests ────────────────────────────────────────────
export async function listMergeRequests(projectId: number, state: 'opened' | 'merged' | 'closed' = 'opened') {
  return glFetch(`/projects/${projectId}/merge_requests?state=${state}&per_page=20`)
}

export async function getMergeRequestChanges(projectId: number, mrIid: number) {
  return glFetch(`/projects/${projectId}/merge_requests/${mrIid}/changes`)
}

// ── Branches ─────────────────────────────────────────────────
export async function listBranches(projectId: number) {
  return glFetch(`/projects/${projectId}/repository/branches?per_page=20`)
}

export async function createBranch(projectId: number, branchName: string, ref: string = 'main') {
  return glFetch(`/projects/${projectId}/repository/branches`, {
    method: 'POST',
    body: JSON.stringify({ branch: branchName, ref }),
  })
}

// ── Pipelines ─────────────────────────────────────────────────
export async function listPipelines(projectId: number) {
  return glFetch(`/projects/${projectId}/pipelines?per_page=10`)
}

// ── CTO Agent — Full Workspace Setup ─────────────────────────
export async function ctaSetupWorkspace(startupName: string, description: string) {
  try {
    // 1. Create main project
    const project = await createProject(
      startupName.toLowerCase().replace(/\s+/g, '-'),
      description,
      'private'
    )
    const pid = project.id

    // 2. Create milestones
    const milestones = await Promise.all([
      createMilestone(pid, 'MVP Foundation', 'Core auth, DB schema, API setup', getDate(14)),
      createMilestone(pid, 'MVP Complete', 'All MVP features built and tested', getDate(28)),
      createMilestone(pid, 'Beta Launch', 'Public beta with monitoring', getDate(56)),
      createMilestone(pid, 'v1.0 Launch', 'Production launch', getDate(84)),
    ])

    // 3. Create initial issues
    const issueTemplates = [
      { title: 'Set up project scaffolding and CI/CD', labels: ['setup', 'devops'], weight: 2 },
      { title: 'Design database schema and ERD', labels: ['backend', 'database'], weight: 3 },
      { title: 'Implement JWT authentication system', labels: ['backend', 'security'], weight: 5 },
      { title: 'Build REST API core endpoints', labels: ['backend', 'api'], weight: 8 },
      { title: 'Set up frontend project with Next.js', labels: ['frontend'], weight: 3 },
      { title: 'Design system and UI component library', labels: ['frontend', 'design'], weight: 5 },
      { title: 'Integrate payment gateway (Razorpay)', labels: ['backend', 'payments'], weight: 5 },
      { title: 'Set up error monitoring (Sentry)', labels: ['devops', 'monitoring'], weight: 2 },
      { title: 'Write API documentation', labels: ['docs'], weight: 3 },
      { title: 'Performance testing and optimization', labels: ['testing', 'performance'], weight: 5 },
    ]

    const issues = await Promise.all(
      issueTemplates.map(issue =>
        createIssue(pid, issue.title, `Created by CTO Agent for ${startupName}`, issue.labels, milestones[0].id, issue.weight)
      )
    )

    return { project, milestones, issues, success: true }
  } catch (error) {
    throw new Error(`GitLab workspace setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function getDate(daysFromNow: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}
