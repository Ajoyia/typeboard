export type TaskStatus = 'todo' | 'doing' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  notes: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  dueDate: string | null
  createdAt: string
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt'>

export const TASK_STATUSES: TaskStatus[] = ['todo', 'doing', 'done']

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

export function emptyTaskDraft(): TaskDraft {
  return {
    title: '',
    notes: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    dueDate: null,
  }
}
