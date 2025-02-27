export interface AccountType {
  title: string
  value: string
}

export interface Account {
  id: number
  label: string
  type: string
  login: string
  password: string | null
}
