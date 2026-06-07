'use client'
// app/tasks/page.tsx — Task Management

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { EXEC_COLORS } from '@/lib/utils'
import { ExecutiveRole } from '@/types'

const STATUS_COLS = [
  { key: 'todo',        label: 'To Do',      color: '#404868' },
  { key: 'in-progress', label: 'In Progress', color: '#4a9eff' },
  { key: 'review',      label: 'Review',      color: '#f59e0b' },
  { key: 'done',        label: 'Done',        color: '#22c55e' },
]

const PRIORITY_COLORS: Record<string, string> = {
  high:   '#ef4444',
  medium: '#f59e0b',
  low:    '#22c55e',
}

export default function TasksPage() {
  const { tasks, addTask, updateTask } = useStore()
  const [view, setView] = useState<'list' | 'board'>('list')
  const [filterExec, setFilterExec] = useState<string>('all')
  const [newTask, setNewTask] = useState({ title: '', assignee: 'CEO' as ExecutiveRole, priority: 'medium' as 'high' | 'medium' | 'low', project: 'SmartCart' })
  const [adding, setAdding] = useState(false)

  const EXECS: ExecutiveRole[] = ['CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CHRO', 'CSO', 'CPO']

  const filtered = filterExec === 'all' ? tasks : tasks.filter(t => t.assignee === filterExec)

  function handleAdd() {
    if (!newTask.title.trim()) return
    addTask({
      id: `t${Date.now()}`,
      title: newTask.title,
      assignee: newTask.assignee,
      project: newTask.project,
      priority: newTask.priority,
      status: 'todo',
      createdAt: new Date(),
    })
    setNewTask({ title: '', assignee: 'CEO', priority: 'medium', project: 'SmartCart' })
    setAdding(false)
  }

  const tabBtn = (label: string, active: boolean, onClick: () => void) => (
    <button onClick={onClick} style={{ padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, background: active ? 'rgba(26,115,232,0.15)' : 'transparent', color: active ? '#4a9eff' : '#7c85a2', border: active ? '1px solid rgba(26,115,232,0.3)' : '1px solid transparent', fontFamily: 'DM Sans' }}>
      {label}
    </button>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>Tasks</h1>
        <p style={{ color: '#7c85a2', fontSize: 12, marginTop: 3 }}>Executive-generated action items across all projects</p>
      </div>

      <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4 }}>
          {tabBtn('List', view === 'list', () => setView('list'))}
          {tabBtn('Board', view === 'board', () => setView('board'))}
        </div>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)' }} />
        {/* Exec filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tabBtn('All', filterExec === 'all', () => setFilterExec('all'))}
          {EXECS.map(e => tabBtn(e, filterExec === e, () => setFilterExec(e)))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setAdding(true)}
          style={{ padding: '6px 14px', background: '#1a73e8', border: 'none', borderRadius: 7, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>
          + Add Task
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Add Task Form */}
        {adding && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111622', animation: 'slideIn 0.2s ease' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Task title..."
                style={{ flex: 1, minWidth: 200, background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '7px 12px', color: '#e2e6f3', fontSize: 13, fontFamily: 'DM Sans', outline: 'none' }} />
              <select value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value as ExecutiveRole }))}
                style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '7px 12px', color: '#e2e6f3', fontSize: 12, fontFamily: 'DM Sans', outline: 'none' }}>
                {EXECS.map(e => <option key={e}>{e}</option>)}
              </select>
              <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value as any }))}
                style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '7px 12px', color: '#e2e6f3', fontSize: 12, fontFamily: 'DM Sans', outline: 'none' }}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
              <select value={newTask.project} onChange={e => setNewTask(p => ({ ...p, project: e.target.value }))}
                style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '7px 12px', color: '#e2e6f3', fontSize: 12, fontFamily: 'DM Sans', outline: 'none' }}>
                <option>SmartCart</option><option>India</option><option>Fundraise</option>
              </select>
              <button onClick={handleAdd} style={{ padding: '7px 14px', background: '#1a73e8', border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>Add</button>
              <button onClick={() => setAdding(false)} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 8, color: '#7c85a2', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filtered.map(task => {
                const ec = EXEC_COLORS[task.assignee as ExecutiveRole] || { color: '#4a9eff' }
                return (
                  <div key={task.id} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, animation: 'slideIn 0.2s ease' }}>
                    <div
                      onClick={() => updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                      style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${task.status === 'done' ? '#1a73e8' : 'rgba(255,255,255,0.2)'}`, background: task.status === 'done' ? '#1a73e8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: 9, color: '#fff' }}>
                      {task.status === 'done' ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: task.status === 'done' ? '#404868' : '#e2e6f3', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</div>
                      <div style={{ fontSize: 10, color: '#404868', marginTop: 2 }}>{task.project} · {task.assignee}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: PRIORITY_COLORS[task.priority], background: `${PRIORITY_COLORS[task.priority]}20`, padding: '2px 7px', borderRadius: 10 }}>{task.priority}</span>
                    <select
                      value={task.status}
                      onChange={e => updateTask(task.id, { status: e.target.value as any })}
                      style={{ background: '#111622', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 7px', color: '#7c85a2', fontSize: 10, fontFamily: 'DM Sans', outline: 'none', cursor: 'pointer' }}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: ec.bg, color: ec.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                      {task.assignee[0]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* BOARD VIEW */}
        {view === 'board' && (
          <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '12px 24px', display: 'flex', gap: 12 }}>
            {STATUS_COLS.map(col => {
              const colTasks = filtered.filter(t => t.status === col.key)
              return (
                <div key={col.key} style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{col.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: '#404868', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 10 }}>{colTasks.length}</span>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {colTasks.map(task => {
                      const ec = EXEC_COLORS[task.assignee as ExecutiveRole] || { color: '#4a9eff', bg: 'rgba(79,142,247,0.15)' }
                      return (
                        <div key={task.id} style={{ background: '#141b29', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '10px 12px', cursor: 'pointer' }}>
                          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 7, lineHeight: 1.4 }}>{task.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 18, height: 18, borderRadius: 4, background: ec.bg, color: ec.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>{task.assignee[0]}</div>
                            <span style={{ fontSize: 9, color: '#404868' }}>{task.assignee}</span>
                            <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, color: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
                          </div>
                        </div>
                      )
                    })}
                    {colTasks.length === 0 && (
                      <div style={{ textAlign: 'center', color: '#404868', fontSize: 11, padding: '20px 0' }}>No tasks</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
