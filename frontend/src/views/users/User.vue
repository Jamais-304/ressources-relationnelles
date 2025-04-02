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

async function initUser() {
  user.value = currentUser.value
}

function askForUpdateConfirmation() {
  currentUser.value = user.value
  confirmationModalVisible.value = true
  confirmationModalMessage.value = `Voulez-vous vraiment modifier l’utilisateur ${user?.value?.username} ?`
}

async function updateUser() {
  if (!user.value) {
    return
  }

  const uuid = user.value.uuid ?? ''

  try {
    const response = await api.users.update(uuid, user.value)
    if (response instanceof User) {
      toast.success('Utilisateur mis à jour avec succès !')
    }
    user.value = response
  } catch (error) {
    toast.error(`Error while listing users: ${error}.`)
  }
}

onMounted(() => initUser())
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto px-4 py-32">
      <div class="bg-white p-8 rounded-lg border border-[#E5E5E5]">
        <UserForm
          v-if="user"
          v-model:username="user.username"
          v-model:email="user.email"
          v-model:role="user.role"
          show-username
    show-email
      show-role
          @save="askForUpdateConfirmation"
        />
        <ConfirmationModal
          v-model="confirmationModalVisible"
          :message="confirmationModalMessage"
          :item="currentUser"
          @confirm="updateUser"
        />
      </div>
    </div>
  </div>
</template>
