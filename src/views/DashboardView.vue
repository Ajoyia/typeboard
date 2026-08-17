<script setup lang="ts">
import { computed } from 'vue'
import type { Activity } from '@/types/activity'
import { useCatalogStore } from '@/stores/catalog'
import { contactName, useContactStore } from '@/stores/contacts'
import { useTaskStore } from '@/stores/tasks'
import { formatDate } from '@/utils/id'
import { formatCents } from '@/utils/money'
import { assertNever, sortBy } from '@/utils/sort'

const taskStore = useTaskStore()
const contactStore = useContactStore()
const catalogStore = useCatalogStore()

type Stat = {
  label: string
  value: string
  hint: string
}

const stats = computed<Stat[]>(() => [
  {
    label: 'Open tasks',
    value: String(taskStore.openCount),
    hint: `${taskStore.highPriorityCount} high priority`,
  },
  {
    label: 'Contacts',
    value: String(contactStore.contacts.length),
    hint: `${contactStore.favoriteCount} starred`,
  },
  {
    label: 'Cart items',
    value: String(catalogStore.cartCount),
    hint: formatCents(catalogStore.cartTotalCents),
  },
  {
    label: 'Catalog SKUs',
    value: String(catalogStore.products.length),
    hint: 'Typed product union',
  },
])

const activities = computed(() => {
  const taskItems: Activity[] = taskStore.tasks.map((task) => ({
    kind: 'task',
    id: task.id,
    title: task.title,
    status: task.status,
    at: task.createdAt,
  }))

  const contactItems: Activity[] = contactStore.contacts.map((contact) => ({
    kind: 'contact',
    id: contact.id,
    name: contactName(contact),
    favorite: contact.favorite,
    at: contact.createdAt,
  }))

  const cartItems: Activity[] = catalogStore.cartLines.map(({ item, product }) => ({
    kind: 'cart',
    id: `${item.productId}-${item.addedAt}`,
    productName: product.name,
    qty: item.qty,
    at: item.addedAt,
  }))

  return sortBy([...taskItems, ...contactItems, ...cartItems], 'at', 'desc').slice(0, 8)
})

function activityLabel(item: Activity): string {
  switch (item.kind) {
    case 'task':
      return `${item.title} · ${item.status}`
    case 'contact':
      return `${item.name}${item.favorite ? ' ★' : ''}`
    case 'cart':
      return `${item.productName} × ${item.qty}`
    default:
      return assertNever(item)
  }
}
</script>

<template>
  <section class="page">
    <h1>Dashboard</h1>
    <p class="lede">
      A typed overview of the lab. Practice computed values, unions, and exhaustive switches.
    </p>
    <div class="focus">
      <span>discriminated unions</span>
      <span>assertNever</span>
      <span>computed&lt;T&gt;</span>
    </div>

    <div class="stats">
      <article v-for="stat in stats" :key="stat.label" class="card stat">
        <p>{{ stat.label }}</p>
        <strong>{{ stat.value }}</strong>
        <small>{{ stat.hint }}</small>
      </article>
    </div>

    <article class="card">
      <h2>Recent activity</h2>
      <ul v-if="activities.length" class="feed">
        <li v-for="item in activities" :key="`${item.kind}-${item.id}`">
          <span class="pill">{{ item.kind }}</span>
          <div>
            <p>{{ activityLabel(item) }}</p>
            <small>{{ formatDate(item.at) }}</small>
          </div>
        </li>
      </ul>
      <p v-else class="empty">No activity yet. Add a task, contact, or cart item.</p>
    </article>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat strong {
  display: block;
  font-size: 1.8rem;
  letter-spacing: -0.04em;
}

.stat p,
.stat small {
  color: var(--muted);
}

h2 {
  margin-bottom: 0.8rem;
}

.feed {
  list-style: none;
  display: grid;
  gap: 0.75rem;
}

.feed li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.feed small {
  color: var(--muted);
}
</style>
