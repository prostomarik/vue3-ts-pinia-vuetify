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

    <div v-if="!accounts.length" class="d-flex justify-center">Учетных записей не существует</div>
    <div v-else class="main-view__labels">
      <div>Метки</div>
      <div>Тип записи</div>
      <div>Логин</div>
      <div v-if="accounts.some((a) => a.type === 'local')">Пароль</div>
    </div>

    <div class="main-view__accounts">
      <div v-for="account in accounts" :key="account.id" class="main-view__account">
        <v-text-field label="Значение" variant="outlined" hide-details>
          {{ account.label }}
        </v-text-field>

        <v-select
          v-model="account.type"
          :items="accountTypes"
          label="Значение"
          variant="outlined"
          hide-details
        />

        <v-text-field label="Значение" variant="outlined" hide-details>
          {{ account.login }}
        </v-text-field>

        <v-text-field v-if="account.type === 'local'" variant="outlined" hide-details>
          {{ account.password }}
        </v-text-field>

        <v-btn
          icon="mdi-delete-outline"
          variant="text"
          hide-details
          @click="deleteAccount(account.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const accountTypes = [
  {
    title: 'LDAP',
    value: 'ldap',
  },
  {
    title: 'Локальная',
    value: 'local',
  },
]

interface Account {
  id: number
  label: string
  type: string
  login: string
  password: string | null
}

const accounts = ref<Account[]>([])

function addAccount() {
  accounts.value.push({
    id: Date.now(),
    label: '',
    type: 'ldap',
    login: '',
    password: null,
  })
}

function deleteAccount(id: number) {
  accounts.value = accounts.value.filter((a) => a.id !== id)
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
  justify-content: space-around;
  gap: 10px;
  width: calc(100% - 58px);
  margin-bottom: 10px;
}

.main-view__accounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-view__account {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>
