<script setup lang="ts">
import { Api, User } from '@/api/api'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useErrorsManagement } from '@/composables/useErrorsManagement'
import { useUsersManagement } from '@/composables/useUsersManagement'
import { useResourcesManagement } from '@/composables/useResourcesManagement'
import router from '@/routes/router'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const {
  references: { users, currentUser },
} = useUsersManagement()

const {
  references: { resources, currentResource },
} = useResourcesManagement()

const { handleError } = useErrorsManagement()

const confirmationModalVisible = ref(false)
const confirmationModalMessage = ref('')

async function listResources() {
  try {
    const response = await api.resources.list()
    resources.value = response
  } catch (error) {
    handleError(error)
  }
}

function showResource(resource: Resource) {
  currentResource.value = resource
  router.push(`/resources/${resource.uuid}`)
}

// function askForDeleteConfirmation(user: User) {
//   currentUser.value = user
//   confirmationModalVisible.value = true
//   confirmationModalMessage.value = `Voulez-vous vraiment supprimer l’utilisateur ${user.username} ?`
// }

// async function deleteUser(user: User) {
//   try {
//     const response = await api.users.delete(user)
//     console.log(response)
//     if (response.message) {
//       toast.success(response.message)
//     }
//     await listUsers()
//   } catch (error) {
//     handleError(error)
//   }
// }

onMounted(() => listResources())
</script>

<template>
  <v-card class="pa-4 ma-4" elevation="1">
    <div v-for="(resource, index) in resources">
      {{ resource }}
    </div>

    <!-- <v-data-table :items="users" :headers="headers">
      <template #item.actions="{ item }">
        <span class="flex gap-2">
          <v-btn color="#cddeef" @click="() => showUser(item)">Voir</v-btn>
          <v-btn color="#f1c6be" @click="() => askForDeleteConfirmation(item)">
            Supprimer
          </v-btn>
        </span>
      </template>
    </v-data-table> -->
  </v-card>

  <!-- <ConfirmationModal
    v-model="confirmationModalVisible"
    :message="confirmationModalMessage"
    :item="currentUser"
    @confirm="deleteUser"
  ></ConfirmationModal> -->
</template>
