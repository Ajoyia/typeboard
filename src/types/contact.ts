export type ContactKind = 'person' | 'company'

type ContactBase = {
  id: string
  email: string
  favorite: boolean
  createdAt: string
}

export type PersonContact = ContactBase & {
  kind: 'person'
  firstName: string
  lastName: string
  role: string
}

export type CompanyContact = ContactBase & {
  kind: 'company'
  companyName: string
  industry: string
  website: string
}

export type Contact = PersonContact | CompanyContact

export type PersonDraft = Omit<PersonContact, 'id' | 'createdAt'>
export type CompanyDraft = Omit<CompanyContact, 'id' | 'createdAt'>
export type ContactDraft = PersonDraft | CompanyDraft

export const CONTACT_KINDS: ContactKind[] = ['person', 'company']

export function emptyPersonDraft(): PersonDraft {
  return {
    kind: 'person',
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    favorite: false,
  }
}

export function emptyCompanyDraft(): CompanyDraft {
  return {
    kind: 'company',
    companyName: '',
    industry: '',
    website: '',
    email: '',
    favorite: false,
  }
}
