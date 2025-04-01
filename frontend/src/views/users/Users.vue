<script setup lang="ts">
import { Api, User } from '@/api/api'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useUsersManagement } from '@/composables/useUsersManagement'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const {
  references: { users, currentUser },
} = useUsersManagement()

const confirmationModalVisible = ref(false)
const confirmationModalMessage = ref('')

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
  {
    title: '',
    key: 'actions',
    sortable: false,
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

function askForDeleteConfirmation(user: User) {
  currentUser.value = user
  confirmationModalVisible.value = true
  confirmationModalMessage.value = `Voulez-vous vraiment supprimer l’utilisateur ${user.username} ?`
}

async function deleteUser(user: User) {
  try {
    const response = await api.users.delete(user)
    console.log(response)
    if (response.message) {
      toast.success(response.message)
    }
    await listUsers()
  } catch (error) {
    console.error(`Error while listing users: ${error}.`)
  }
}

onMounted(() => listUsers())
</script>

<template>
  <v-card class="pa-4 ma-4" elevation="1">
    <v-data-table :items="users" :headers="headers">
      <template #item.actions="{ item }">
        <span class="flex gap-2">
          <v-btn color="#f1c6be" @click="() => askForDeleteConfirmation(item)">
            Supprimer
          </v-btn>
        </span>
      </template>
    </v-data-table>
  </v-card>

  <ConfirmationModal
    v-model="confirmationModalVisible"
    :message="confirmationModalMessage"
    :item="currentUser"
    @confirm="deleteUser"
  ></ConfirmationModal>
</template>
