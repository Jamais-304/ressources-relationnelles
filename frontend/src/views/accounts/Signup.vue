<script setup lang="ts">
import { Api, Role, User } from '@/api/api'
import UserForm from '@/components/UserForm.vue'
import { useErrorsManagement } from '@/composables/useErrorsManagement'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()
const { setAuthUser } = useAuthUserStore()
const { handleError } = useErrorsManagement()

const username = ref('')
const email = ref('')
const password = ref('')

async function signup() {
  const attrs = {
    username: username.value,
    email: email.value,
    password: password.value,
    role: Role.User,
  }

  try {
    const response = await api.users.create(attrs)
    if (response instanceof User) {
      setAuthUser(response)
      toast.success(`Compte utilisateur créé avec succès !`)
      await router.push('/')
    }
  } catch (error) {
    handleError(error)
  }
}
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

        <h1 class="text-2xl font-bold mb-8 text-center">Inscription</h1>

        <UserForm
          v-model:username="username"
          v-model:email="email"
          v-model:password="password"
          :show-username="true"
          :show-email="true"
          :show-password="true"
          button-text="S'inscrire"
          @save="signup"
        />
      </div>
    </div>
  </div>
</template>
