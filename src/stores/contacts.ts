import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Contact, ContactDraft } from '@/types/contact'
import { seedContacts } from '@/data/seed'
import { usePersistedRef } from '@/composables/usePersistedRef'
import { createId, nowIso } from '@/utils/id'

export function contactName(contact: Contact): string {
  if (contact.kind === 'person') return `${contact.firstName} ${contact.lastName}`
  return contact.companyName
}

export const useContactStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>(seedContacts)
  usePersistedRef('typeboard.contacts', contacts)

  const favoriteCount = computed(() => contacts.value.filter((contact) => contact.favorite).length)

  function addContact(draft: ContactDraft): Contact {
    const contact: Contact = {
      ...draft,
      id: createId('contact'),
      createdAt: nowIso(),
    }
    contacts.value = [contact, ...contacts.value]
    return contact
  }

  function toggleFavorite(id: string): void {
    contacts.value = contacts.value.map((contact) =>
      contact.id === id ? { ...contact, favorite: !contact.favorite } : contact,
    )
  }

  function removeContact(id: string): void {
    contacts.value = contacts.value.filter((contact) => contact.id !== id)
  }

  return {
    contacts,
    favoriteCount,
    addContact,
    toggleFavorite,
    removeContact,
  }
})
