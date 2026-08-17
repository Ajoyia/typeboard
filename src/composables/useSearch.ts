import { computed, type ComputedRef } from 'vue'

export function useSearch<T>(
  items: ComputedRef<T[]> | { value: T[] },
  query: { value: string },
  match: (item: T, needle: string) => boolean,
) {
  return computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return items.value
    return items.value.filter((item) => match(item, needle))
  })
}
