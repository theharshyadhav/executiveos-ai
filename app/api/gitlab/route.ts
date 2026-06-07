// app/api/gitlab/route.ts — GitLab MCP Integration Endpoint

import { NextRequest, NextResponse } from 'next/server'
import {
  createProject, listProjects, getProject,
  createMilestone, listMilestones,
  createIssue, listIssues, updateIssue,
  listMergeRequests, getMergeRequestChanges,
  listBranches, createBranch,
  listPipelines, ctaSetupWorkspace,
} from '@/lib/gitlab'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...params } = body

    if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 })

    switch (action) {
      // Projects
      case 'create_project':
        return ok(await createProject(params.name, params.description, params.visibility))
      case 'list_projects':
        return ok(await listProjects(params.search))
      case 'get_project':
        return ok(await getProject(params.projectId))

      // Milestones
      case 'create_milestone':
        return ok(await createMilestone(params.projectId, params.title, params.description, params.dueDate))
      case 'list_milestones':
        return ok(await listMilestones(params.projectId))

      // Issues
      case 'create_issue':
        return ok(await createIssue(params.projectId, params.title, params.description, params.labels, params.milestoneId, params.weight))
      case 'list_issues':
        return ok(await listIssues(params.projectId, params.state))
      case 'update_issue':
        return ok(await updateIssue(params.projectId, params.issueIid, params.updates))

      // Merge Requests
      case 'list_mrs':
        return ok(await listMergeRequests(params.projectId, params.state))
      case 'get_mr_changes':
        return ok(await getMergeRequestChanges(params.projectId, params.mrIid))

      // Branches
      case 'list_branches':
        return ok(await listBranches(params.projectId))
      case 'create_branch':
        return ok(await createBranch(params.projectId, params.branchName, params.ref))

      // Pipelines
      case 'list_pipelines':
        return ok(await listPipelines(params.projectId))

      // CTO Agent — Full Workspace
      case 'cto_setup_workspace':
        return ok(await ctaSetupWorkspace(params.startupName, params.description))

      default:
        return NextResponse.json({ error: `Unknown GitLab action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GitLab API error'
    const status = message.includes('401') ? 401 : message.includes('404') ? 404 : 500
    return NextResponse.json({ error: message, success: false }, { status })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    integration: 'GitLab MCP',
    actions: [
      'create_project', 'list_projects', 'get_project',
      'create_milestone', 'list_milestones',
      'create_issue', 'list_issues', 'update_issue',
      'list_mrs', 'get_mr_changes',
      'list_branches', 'create_branch',
      'list_pipelines', 'cto_setup_workspace',
    ],
  })
}

function ok(data: unknown) {
  return NextResponse.json({ success: true, data })
}
