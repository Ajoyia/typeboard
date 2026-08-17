import type { SortDir } from '@/types/common'

function compareValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), undefined, { sensitivity: 'base' })
}

export function sortBy<T, K extends keyof T>(items: T[], key: K, dir: SortDir = 'asc'): T[] {
  return [...items].sort((left, right) => {
    const a = left[key]
    const b = right[key]
    if (a === b) return 0
    if (a == null) return 1
    if (b == null) return -1
    const result = compareValues(a, b)
    return dir === 'asc' ? result : -result
  })
}

export function groupBy<T, K extends string>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item)
      const bucket = acc[key] ?? []
      bucket.push(item)
      acc[key] = bucket
      return acc
    },
    {} as Record<K, T[]>,
  )
}

export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`)
}
