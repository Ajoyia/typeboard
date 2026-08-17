<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  emptyCompanyDraft,
  emptyPersonDraft,
  type CompanyDraft,
  type Contact,
  type ContactKind,
  type PersonDraft,
} from '@/types/contact'
import { contactName, useContactStore } from '@/stores/contacts'
import { useSearch } from '@/composables/useSearch'
import { formatDate } from '@/utils/id'
import { isEmptyErrors, validateContactDraft, type ContactFieldErrors } from '@/utils/validate'

const store = useContactStore()
const kind = ref<ContactKind>('person')
const person = reactive<PersonDraft>(emptyPersonDraft())
const company = reactive<CompanyDraft>(emptyCompanyDraft())
const errors = ref<ContactFieldErrors>({})
const query = ref('')

const draft = computed(() => (kind.value === 'person' ? person : company))

const email = computed({
  get: () => draft.value.email,
  set: (value: string) => {
    draft.value.email = value
  },
})

const favorite = computed({
  get: () => draft.value.favorite,
  set: (value: boolean) => {
    draft.value.favorite = value
  },
})

const results = useSearch(
  computed(() => store.contacts),
  query,
  (contact, needle) => {
    const haystack = [contactName(contact), contact.email, contact.kind]
    if (contact.kind === 'person') haystack.push(contact.role, contact.firstName, contact.lastName)
    if (contact.kind === 'company') haystack.push(contact.industry, contact.companyName)
    return haystack.join(' ').toLowerCase().includes(needle)
  },
)

function setKind(next: ContactKind): void {
  kind.value = next
  errors.value = {}
}

function submit(): void {
  const current = draft.value
  errors.value = validateContactDraft(current)
  if (!isEmptyErrors(errors.value)) return
  store.addContact({ ...current })
  Object.assign(person, emptyPersonDraft())
  Object.assign(company, emptyCompanyDraft())
  errors.value = {}
}

function subtitle(contact: Contact): string {
  if (contact.kind === 'person') return contact.role || 'No role'
  return contact.industry || 'No industry'
}
</script>

<template>
  <section class="page">
    <h1>Contacts</h1>
    <p class="lede">
      Person vs company is a discriminated union. Change kind and TypeScript narrows the fields.
    </p>
    <div class="focus">
      <span>discriminated unions</span>
      <span>generic useSearch</span>
      <span>keyof drafts</span>
    </div>

    <form class="card grid" @submit.prevent="submit">
      <div class="row">
        <button
          class="btn"
          :class="{ ghost: kind !== 'person' }"
          type="button"
          @click="setKind('person')"
        >
          Person
        </button>
        <button
          class="btn"
          :class="{ ghost: kind !== 'company' }"
          type="button"
          @click="setKind('company')"
        >
          Company
        </button>
      </div>

      <div v-if="kind === 'person'" class="row">
        <label class="field">
          <span>First name</span>
          <input v-model="person.firstName" />
          <small v-if="errors.firstName" class="err">{{ errors.firstName }}</small>
        </label>
        <label class="field">
          <span>Last name</span>
          <input v-model="person.lastName" />
          <small v-if="errors.lastName" class="err">{{ errors.lastName }}</small>
        </label>
        <label class="field">
          <span>Role</span>
          <input v-model="person.role" placeholder="Engineer" />
        </label>
      </div>

      <div v-else class="row">
        <label class="field">
          <span>Company</span>
          <input v-model="company.companyName" />
          <small v-if="errors.companyName" class="err">{{ errors.companyName }}</small>
        </label>
        <label class="field">
          <span>Industry</span>
          <input v-model="company.industry" placeholder="Developer tools" />
        </label>
        <label class="field">
          <span>Website</span>
          <input v-model="company.website" placeholder="https://" />
        </label>
      </div>

      <div class="row">
        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" />
          <small v-if="errors.email" class="err">{{ errors.email }}</small>
        </label>
        <label class="check">
          <input v-model="favorite" type="checkbox" />
          Favorite
        </label>
        <button class="btn" type="submit">Save contact</button>
      </div>
    </form>

    <label class="field search">
      <span>Search</span>
      <input v-model="query" placeholder="Name, email, role, industry" />
    </label>

    <ul class="list">
      <li v-for="contact in results" :key="contact.id" class="card">
        <div class="head">
          <div>
            <h2>{{ contactName(contact) }}</h2>
            <p>{{ subtitle(contact) }} · {{ contact.email }}</p>
          </div>
          <span class="pill">{{ contact.kind }}</span>
        </div>
        <div class="row meta">
          <span class="pill">{{ formatDate(contact.createdAt) }}</span>
          <a v-if="contact.kind === 'company' && contact.website" :href="contact.website">
            {{ contact.website }}
          </a>
          <button class="btn ghost" type="button" @click="store.toggleFavorite(contact.id)">
            {{ contact.favorite ? 'Starred' : 'Star' }}
          </button>
          <button class="btn danger" type="button" @click="store.removeContact(contact.id)">
            Delete
          </button>
        </div>
      </li>
    </ul>
    <p v-if="!results.length" class="empty">No contacts match that search.</p>
  </section>
</template>

<style scoped>
.search {
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
}

.head h2 {
  font-size: 1.05rem;
}

.head p,
.meta {
  color: var(--muted);
}

.meta {
  margin-top: 0.7rem;
}

.check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.check input {
  width: auto;
}
</style>
