<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/', label: 'Dashboard', name: 'dashboard' },
  { to: '/tasks', label: 'Tasks', name: 'tasks' },
  { to: '/contacts', label: 'Contacts', name: 'contacts' },
  { to: '/catalog', label: 'Catalog', name: 'catalog' },
] as const
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <span class="mark">Tb</span>
        <div>
          <p class="name">Typeboard</p>
          <p class="tag">Vue 3 + TypeScript lab</p>
        </div>
      </div>
      <nav>
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          :class="{ active: route.name === link.name }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--line);
  background: var(--panel);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mark {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.7rem;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: var(--paper);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.name {
  font-weight: 700;
  color: var(--ink);
  line-height: 1.1;
}

.tag {
  font-size: 0.75rem;
  color: var(--muted);
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

nav a {
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  color: var(--muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

nav a:hover,
nav a.active {
  background: var(--chip);
  color: var(--ink);
}

main {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem;
}

@media (max-width: 720px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
