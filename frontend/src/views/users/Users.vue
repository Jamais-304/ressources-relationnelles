<script setup lang="ts">
import { Api, User } from '@/api/api'
import { onMounted, ref } from 'vue'

const api = new Api()

const users = ref<User[]>()

const headers = [
  {
    title: 'Pseudonyme',
    value: 'username',
    sortable: true,
  },
  {
    title: 'Email',
    value: 'email',
    sortable: true,
  },
  {
    title: 'Rôle',
    value: 'role',
    sortable: true,
  },
  {
    title: 'Créé le',
    value: 'createdAt',
    sortable: true,
  },
  {
    title: 'Modifié le',
    value: 'updatedAt',
    sortable: true,
  },
]

async function listUsers() {
  try {
    const response = await api.users.list()
    users.value = response
  } catch (error) {
    console.error(`Error while listing users: ${error}.`)
  }
}

onMounted(() => listUsers())
</script>

<template>
  <v-card class="pa-4 ma-4" elevation="1">
    <v-data-table :items="users" :headers="headers"> </v-data-table>
  </v-card>
</template>
