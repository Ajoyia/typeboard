export type Id = string

export type SortDir = 'asc' | 'desc'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export type WithId<T> = T & { id: Id }
