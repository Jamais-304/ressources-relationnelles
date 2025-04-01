<script setup lang="ts">
import { Api, Role, User } from '@/api/api'
import UserForm from '@/components/UserForm.vue'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const { setAuthUser } = useAuthUserStore()

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
    toast.error(error)
  }
}
</script>

<template>
  <UserForm
    v-model:username="username"
    v-model:email="email"
    v-model:password="password"
    button-text="Créer mon compte"
    show-username
    show-email
    show-password
    @save="signup"
  />
</template>
