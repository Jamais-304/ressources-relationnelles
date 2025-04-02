<script setup lang="ts">
import { Api, User } from '@/api/api'
import UserForm from '@/components/UserForm.vue'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()
const { setAuthUser } = useAuthUserStore()

const email = ref('admintest@test.com')
const password = ref('Admin123!')

async function login() {
  const attrs = {
    email: email.value,
    password: password.value,
  }
  try {
    const response = await api.users.login(attrs)
    if (response instanceof User) {
      setAuthUser(response)
      toast.success(`Bienvenue ${response.username} !`)
      await router.push('/')
    }
  } catch (error) {
    toast.error(error)
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

        <h1 class="text-2xl font-bold mb-8 text-center">Connexion</h1>

        <UserForm
          v-model:email="email"
          v-model:password="password"
          :show-email="true"
          :show-password="true"
          button-text="Se connecter"
          @save="login"
        />
      </div>
    </div>
  </div>
</template>
