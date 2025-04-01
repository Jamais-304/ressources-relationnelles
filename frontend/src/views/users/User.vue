<script setup lang="ts">
import { Api, User } from '@/api/api'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import UserForm from '@/components/UserForm.vue'
import { useUsersManagement } from '@/composables/useUsersManagement'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const {
  references: { currentUser },
} = useUsersManagement()

const user = ref<User>()

const confirmationModalVisible = ref(false)
const confirmationModalMessage = ref('')

async function getUser() {
  user.value = currentUser.value
}

function askForUpdateConfirmation() {
  currentUser.value = user.value
  confirmationModalVisible.value = true
  confirmationModalMessage.value = `Voulez-vous vraiment modifier l’utilisateur ${user?.value?.username} ?`
}

async function updateUser() {
  const userData = user.value as User
  try {
    const response = await api.users.update(userData, userData)
    if (response instanceof User) {
      toast.success('Utilisateur mis à jour avec succès !')
    }
    await getUser()
  } catch (error) {
    toast.error(`Error while listing users: ${error}.`)
  }
}

onMounted(() => getUser())
</script>

<template>
  <UserForm
    v-if="user"
    v-model:username="user.username"
    v-model:email="user.email"
    v-model:role="user.role"
    show-username
    show-email
    show-role
    @save="askForUpdateConfirmation"
  >
  </UserForm>
  <ConfirmationModal
    v-model="confirmationModalVisible"
    :message="confirmationModalMessage"
    :item="currentUser"
    @confirm="updateUser"
  ></ConfirmationModal>
</template>
