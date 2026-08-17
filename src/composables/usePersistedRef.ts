import type { Ref } from 'vue'
import { watch } from 'vue'
import { loadJson, saveJson } from '@/utils/storage'

export function usePersistedRef<T>(key: string, source: Ref<T>): void {
  source.value = loadJson(key, source.value)

  watch(
    source,
    (value) => {
      saveJson(key, value)
    },
    { deep: true },
  )
}
