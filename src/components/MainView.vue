<template>
  <div class="main-view">
    <div class="main-view__title">
      <h1>Учетные записи</h1>
      <v-btn icon="mdi-plus" size="small" variant="outlined" @click="addAccount()" />
    </div>

    <div class="main-view__help">
      <v-btn icon="mdi-help" size="small" variant="outlined" />
      <div>Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</div>
    </div>

    <div v-if="!store.accounts.length" class="d-flex justify-center">
      Учетных записей не существует
    </div>
    <div v-else class="main-view__labels">
      <div>Метки</div>
      <div>Тип записи</div>
      <div :style="!store.anyLocalAccountsExists ? { width: '50%' } : {}">Логин</div>
      <div v-if="store.anyLocalAccountsExists" style="width: calc(25% - 10px)">Пароль</div>
    </div>

    <div class="main-view__accounts">
      <v-form
        v-for="account in store.accounts"
        :key="account.id"
        :ref="(el) => (refs[account.id] = el)"
        class="main-view__account"
      >
        <v-text-field
          :modelValue="parseArray(account.label)"
          :rules="[validatorRules.label(account)]"
          label="Значение"
          variant="outlined"
          width="25%"
          @change="parseString(account, $event.target.value)"
        />

        <v-select
          v-model="account.type"
          :items="accountTypes"
          variant="outlined"
          width="25%"
          @update:modelValue="updateAccount(account)"
        />

        <v-text-field
          v-model="account.login"
          :width="account.type === 'local' ? '25%' : '50%'"
          :rules="[validatorRules.login(account)]"
          label="Значение"
          variant="outlined"
          @change="updateAccount(account)"
        />

        <v-text-field
          v-if="account.type === 'local'"
          v-model="account.password"
          :rules="[validatorRules.password(account)]"
          :type="showPasswords ? 'text' : 'password'"
          :append-inner-icon="showPasswords ? 'mdi-eye' : 'mdi-eye-off'"
          width="calc(25% - 10px)"
          label="Значение"
          variant="outlined"
          @click:append-inner="showPasswords = !showPasswords"
          @change="updateAccount(account)"
        />

        <v-btn icon="mdi-delete-outline" variant="text" @click="deleteAccount(account.id)" />
      </v-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'

import { useStore } from '@/stores/mainStore.ts'

import type { AccountLabel, AccountType } from '@/interfaces'
import type { Account } from '@/interfaces'
import type { Refs } from '@/interfaces'

const store = useStore()

const accountTypes: AccountType[] = [
  {
    title: 'LDAP',
    value: 'ldap',
  },
  {
    title: 'Локальная',
    value: 'local',
  },
]

const validatorRules = {
  label: (account: Account) => account.label.length < 50 || 'Максимум 50 символов',
  login: (account: Account) =>
    !!account.login.length
      ? account.login.length < 100 || 'Максимум 100 символов'
      : 'Это поле обязательное',
  password: (account: Account) =>
    !!account.password?.length
      ? account.password.length < 100 || 'Максимум 100 символов'
      : 'Это поле обязательное',
}

const showPasswords: Ref<boolean> = ref(false)
const refs: Ref<Refs> = ref({})

function addAccount() {
  store.addAccount({
    id: Date.now(),
    label: '',
    type: 'ldap',
    login: '',
    password: null,
  })
}

async function updateAccount(account: Account) {
  const { valid } = await refs.value[account.id].validate()
  if (valid) {
    store.updateAccount(account)
  }
}

function deleteAccount(id: number) {
  store.deleteAccount(id)
}

function parseArray(label: string | AccountLabel[]) {
  return typeof label !== 'string'
    ? label.reduce((string: string, { text }: { text: string }) => {
        string += `${text}; `
        return string
      }, '')
    : ''
}

function parseString(account: Account, value: string) {
  account.label = value.split(';').reduce((arr: AccountLabel[], text: string) => {
    text = text.trim()

    if (text) {
      arr.push({ text })
    }

    return arr
  }, [])

  updateAccount(account)
}
</script>

<style scoped>
.main-view {
  padding: 50px;
}

.main-view__title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.main-view__help {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  background-color: #eaf1f8;
  padding: 10px;
  border-radius: 5px;
}

.main-view__labels {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: calc(100% - 58px);
  margin-bottom: 10px;
}

.main-view__labels div {
  width: 25%;
}

.main-view__accounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-view__account {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
