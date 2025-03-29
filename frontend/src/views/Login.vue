<script setup lang="ts">
import { Api } from '@/api/api'
import router from '@/routes/router'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const email = ref('admintest@test.com')
const password = ref('admintest')

async function login() {
  const attrs = {
    email: email.value,
    password: password.value
  }
  try {
    const response = await api.users.login(attrs)
    response.access && toast.success('Bienvenue !') && router.push('/')
  } catch (error) {
    toast.error(error)
  }
}

</script>

<template>
  <div>
    <RouterLink to="/">Retour à l’accueil</RouterLink>
  </div>

  <div>Email</div>
  <input v-model="email" placeholder="test@test.com"></input>

  <div>Mot de passe</div>
  <input v-model="password" placeholder=""></input>

  <div>
    <button @click="login()">Se connecter</button>
  </div>
</template>
