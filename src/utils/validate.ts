import type { FieldErrors } from '@/types/common'
import type { CompanyDraft, ContactDraft, PersonDraft } from '@/types/contact'
import type { TaskDraft } from '@/types/task'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactFieldErrors = Partial<Record<keyof PersonDraft | keyof CompanyDraft, string>>

export function isEmptyErrors<T extends object>(errors: T): boolean {
  return Object.values(errors).every((value) => !value)
}

export function validateTaskDraft(draft: TaskDraft): FieldErrors<TaskDraft> {
  const errors: FieldErrors<TaskDraft> = {}
  if (!draft.title.trim()) errors.title = 'Title is required'
  if (draft.title.length > 80) errors.title = 'Keep it under 80 characters'
  if (draft.dueDate && Number.isNaN(new Date(draft.dueDate).getTime())) {
    errors.dueDate = 'Use a valid date'
  }
  return errors
}

export function validateContactDraft(draft: ContactDraft): ContactFieldErrors {
  const errors: ContactFieldErrors = {}
  if (!draft.email.trim()) errors.email = 'Email is required'
  else if (!emailPattern.test(draft.email)) errors.email = 'Email looks invalid'

  if (draft.kind === 'person') {
    if (!draft.firstName.trim()) errors.firstName = 'First name is required'
    if (!draft.lastName.trim()) errors.lastName = 'Last name is required'
  }

  if (draft.kind === 'company') {
    if (!draft.companyName.trim()) errors.companyName = 'Company name is required'
  }

  return errors
}
