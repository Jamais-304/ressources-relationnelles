<script setup lang="ts">
import { Api, User } from '@/api/api'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import UserForm from '@/components/UserForm.vue'
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const { authUser } = storeToRefs(useAuthUserStore())
const { setAuthUser } = useAuthUserStore()

const authUsername = ref('')
const authEmail = ref('')
const currentPassword = ref('')
const updatePassword = ref('')
const updatePasswordConfirmation = ref('')

function initReferences() {
  if (!authUser.value) {
    return
  }
  const { username, email } = authUser.value
  authUsername.value = username
  authEmail.value = email
}

const confirmationModalVisible = ref(false)
const confirmationModalMessage = ref('')

function askForUpdateConfirmation() {
  confirmationModalVisible.value = true
  confirmationModalMessage.value = `Voulez-vous vraiment modifier votre profil ?`
}

async function updateUser() {
  const uuid = authUser?.value?.uuid ?? ''

  const attrs = {
    username: authUsername.value,
    email: authEmail.value,
    password: currentPassword.value,
    newPassword: updatePassword.value,
  }

  try {
    const response = await api.users.update(uuid, attrs)
    if (response instanceof User) {
      toast.success('Votre compte a été mis à jour avec succès !')
    }
    setAuthUser(response)
  } catch (error) {
    toast.error(`Error while listing users: ${error}.`)
  }
}

onMounted(() => initReferences())
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md mx-auto px-4 py-32">
      <div class="bg-white p-8 rounded-lg border border-[#E5E5E5]">
        <div class="mb-6">
          <RouterLink to="/" class="text-[#000091] hover:text-[#1212ff]">
            ← Retour à l'accueil
          </RouterLink>
        </div>
        <UserForm
          v-model:username="authUsername"
          v-model:email="authEmail"
          v-model:password="currentPassword"
          v-model:update-password="updatePassword"
          v-model:update-password-confirmation="updatePasswordConfirmation"
          show-username
          show-email
          show-password
          show-update-password
          show-update-password-confirmation
          password-label="Mot de passe actuel"
          @save="askForUpdateConfirmation"
        >
        </UserForm>
      </div>
    </div>
  </div>
  <ConfirmationModal
    v-model="confirmationModalVisible"
    :message="confirmationModalMessage"
    @confirm="updateUser"
  ></ConfirmationModal>
</template>
