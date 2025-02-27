import { computed, type Ref, ref } from 'vue'

import { defineStore } from 'pinia'

import type { Account } from '@/interfaces'

const ACCOUNTS_LOCAL_STORAGE_KEY = 'accounts'

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

  function updateAccount(account: Account) {
    if (account.type === 'ldap') {
      account.password = null
    }

    accounts.value[accounts.value.findIndex((a) => a.id === account.id)] = account
    saveAccounts()
  }

  function deleteAccount(id: number) {
    accounts.value = accounts.value.filter((a) => a.id !== id)
    saveAccounts()
  }

  return { accounts, anyLocalAccountsExists, addAccount, updateAccount, deleteAccount }
})
