<script setup lang="ts">
import { Api, User } from '@/api/api'
import UserForm from '@/components/UserForm.vue'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const email = ref('admintest@test.com')
const password = ref('admintest')

const { setAuthUser } = useAuthUserStore()

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
  <div>
    <RouterLink to="/">Retour à l’accueil</RouterLink>
  </div>
  <UserForm
    v-model:email="email"
    v-model:password="password"
    button-text="Se connecter"
    show-email
    show-password
    @save="login"
  />
</template>
