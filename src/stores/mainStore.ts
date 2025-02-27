import { computed, type Ref, ref } from 'vue'

import { defineStore } from 'pinia'

const ACCOUNTS_LOCAL_STORAGE_KEY = 'accounts'

interface Account {
  id: number
  label: string
  type: string
  login: string
  password: string | null
}

export const useStore = defineStore('store', () => {
  function getAccounts() {
    const accounts = localStorage.getItem(ACCOUNTS_LOCAL_STORAGE_KEY)
    return accounts ? JSON.parse(accounts) : []
  }

  const accounts: Ref<Account[]> = ref(getAccounts())

  const anyLocalAccountsExists = computed(() => {
    return accounts.value.some((a) => a.type === 'local')
  })

  function saveAccounts() {
    localStorage.setItem(ACCOUNTS_LOCAL_STORAGE_KEY, JSON.stringify(accounts.value))
  }

  function addAccount(account: Account) {
    accounts.value.push(account)
    saveAccounts()
  }

  function deleteAccount(id: number) {
    accounts.value = accounts.value.filter((a) => a.id !== id)
    saveAccounts()
  }

  return { accounts, anyLocalAccountsExists, addAccount, deleteAccount }
})
