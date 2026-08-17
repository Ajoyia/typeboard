<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { FieldErrors } from '@/types/common'
import {
  emptyTaskDraft,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskDraft,
  type TaskPriority,
  type TaskStatus,
} from '@/types/task'
import { useTaskStore } from '@/stores/tasks'
import { formatDate } from '@/utils/id'
import { sortBy } from '@/utils/sort'
import { isEmptyErrors, validateTaskDraft } from '@/utils/validate'

const store = useTaskStore()
const draft = reactive<TaskDraft>(emptyTaskDraft())
const errors = ref<FieldErrors<TaskDraft>>({})
const statusFilter = ref<TaskStatus | 'all'>('all')
const sortKey = ref<'createdAt' | 'priority' | 'title'>('createdAt')
const tagInput = ref('')

const visibleTasks = computed(() => {
  const filtered =
    statusFilter.value === 'all'
      ? store.tasks
      : store.tasks.filter((task) => task.status === statusFilter.value)
  return sortBy(filtered, sortKey.value, sortKey.value === 'title' ? 'asc' : 'desc')
})

function addTag(): void {
  const tag = tagInput.value.trim().toLowerCase()
  if (!tag || draft.tags.includes(tag)) return
  draft.tags = [...draft.tags, tag]
  tagInput.value = ''
}

function removeTag(tag: string): void {
  draft.tags = draft.tags.filter((entry) => entry !== tag)
}

function submit(): void {
  errors.value = validateTaskDraft(draft)
  if (!isEmptyErrors(errors.value)) return
  store.addTask({ ...draft, tags: [...draft.tags] })
  Object.assign(draft, emptyTaskDraft())
  errors.value = {}
}

function cycleStatus(id: string, status: TaskStatus): void {
  const order: TaskStatus[] = ['todo', 'doing', 'done']
  const index = order.indexOf(status)
  const next = order[(index + 1) % order.length]
  if (!next) return
  store.updateStatus(id, next)
}

function onPriority(id: string, event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  if (isPriority(value)) store.updatePriority(id, value)
}

function isPriority(value: string): value is TaskPriority {
  return TASK_PRIORITIES.includes(value as TaskPriority)
}

function isStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.includes(value as TaskStatus)
}

function onFilter(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  statusFilter.value = value === 'all' || isStatus(value) ? value : 'all'
}

function onDueDate(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  draft.dueDate = value || null
}
</script>

<template>
  <section class="page">
    <h1>Tasks</h1>
    <p class="lede">CRUD with unions, type guards, and a generic sort helper.</p>
    <div class="focus">
      <span>TaskStatus union</span>
      <span>FieldErrors&lt;T&gt;</span>
      <span>sortBy&lt;T, K&gt;</span>
      <span>type guards</span>
    </div>

    <form class="card grid" @submit.prevent="submit">
      <div class="row">
        <label class="field">
          <span>Title</span>
          <input v-model="draft.title" placeholder="Practice generics" />
          <small v-if="errors.title" class="err">{{ errors.title }}</small>
        </label>
        <label class="field">
          <span>Status</span>
          <select v-model="draft.status">
            <option v-for="status in TASK_STATUSES" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>Priority</span>
          <select v-model="draft.priority">
            <option v-for="priority in TASK_PRIORITIES" :key="priority" :value="priority">
              {{ priority }}
            </option>
          </select>
        </label>
        <label class="field">
          <span>Due date</span>
          <input type="date" :value="draft.dueDate ?? ''" @input="onDueDate" />
        </label>
      </div>
      <label class="field">
        <span>Notes</span>
        <textarea v-model="draft.notes" rows="2" placeholder="What TypeScript concept is this?" />
      </label>
      <div class="row">
        <label class="field">
          <span>Tags</span>
          <input
            v-model="tagInput"
            placeholder="unions, then Enter"
            @keydown.enter.prevent="addTag"
          />
        </label>
        <button class="btn ghost" type="button" @click="addTag">Add tag</button>
        <button class="btn" type="submit">Add task</button>
      </div>
      <div class="row">
        <span v-for="tag in draft.tags" :key="tag" class="pill" @click="removeTag(tag)">
          {{ tag }} ×
        </span>
      </div>
    </form>

    <div class="row toolbar">
      <label class="field">
        <span>Filter</span>
        <select :value="statusFilter" @change="onFilter">
          <option value="all">all</option>
          <option v-for="status in TASK_STATUSES" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Sort</span>
        <select v-model="sortKey">
          <option value="createdAt">created</option>
          <option value="priority">priority</option>
          <option value="title">title</option>
        </select>
      </label>
    </div>

    <ul class="list">
      <li v-for="task in visibleTasks" :key="task.id" class="card">
        <div class="head">
          <h2>{{ task.title }}</h2>
          <button class="btn ghost" type="button" @click="cycleStatus(task.id, task.status)">
            {{ task.status }}
          </button>
        </div>
        <p v-if="task.notes">{{ task.notes }}</p>
        <div class="row meta">
          <select :value="task.priority" @change="onPriority(task.id, $event)">
            <option v-for="priority in TASK_PRIORITIES" :key="priority" :value="priority">
              {{ priority }}
            </option>
          </select>
          <span class="pill">due {{ formatDate(task.dueDate) }}</span>
          <span v-for="tag in task.tags" :key="tag" class="pill">{{ tag }}</span>
          <button class="btn danger" type="button" @click="store.removeTask(task.id)">
            Delete
          </button>
        </div>
      </li>
    </ul>
    <p v-if="!visibleTasks.length" class="empty">No tasks match this filter.</p>
  </section>
</template>

<style scoped>
.toolbar {
  margin: 1rem 0;
}

.list {
  list-style: none;
  display: grid;
  gap: 0.8rem;
}

.head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.head h2 {
  font-size: 1.05rem;
}

.meta {
  margin-top: 0.7rem;
}

.pill {
  cursor: pointer;
}

select {
  max-width: 10rem;
}
</style>
