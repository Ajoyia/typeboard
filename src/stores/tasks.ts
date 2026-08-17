import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Task, TaskDraft, TaskPriority, TaskStatus } from '@/types/task'
import { seedTasks } from '@/data/seed'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { createId, nowIso } from '@/utils/id'
import { groupBy } from '@/utils/sort'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(seedTasks)
  usePersistedRef('typeboard.tasks', tasks)

  const byStatus = computed(() => groupBy(tasks.value, (task) => task.status))

  const openCount = computed(() => tasks.value.filter((task) => task.status !== 'done').length)

  const highPriorityCount = computed(
    () => tasks.value.filter((task) => task.priority === 'high' && task.status !== 'done').length,
  )

  function addTask(draft: TaskDraft): Task {
    const task: Task = {
      ...draft,
      id: createId('task'),
      createdAt: nowIso(),
    }
    tasks.value = [task, ...tasks.value]
    return task
  }

  function updateStatus(id: string, status: TaskStatus): void {
    tasks.value = tasks.value.map((task) => (task.id === id ? { ...task, status } : task))
  }

  function updatePriority(id: string, priority: TaskPriority): void {
    tasks.value = tasks.value.map((task) => (task.id === id ? { ...task, priority } : task))
  }

  function removeTask(id: string): void {
    tasks.value = tasks.value.filter((task) => task.id !== id)
  }

  return {
    tasks,
    byStatus,
    openCount,
    highPriorityCount,
    addTask,
    updateStatus,
    updatePriority,
    removeTask,
  }
})
