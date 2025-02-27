import type { VForm } from 'vuetify/components'

export interface AccountType {
  title: string
  value: string
}

export interface AccountLabel {
  text: string
}

export interface Account {
  id: number
  label: string | AccountLabel[]
  type: string
  login: string
  password: string | null
}

export interface Refs {
  [id: number]: VForm
}
