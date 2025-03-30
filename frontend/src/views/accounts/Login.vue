<script setup lang="ts">
import { Api, User } from '@/api/api'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const validLoginForm = ref(false)

const email = ref('admintest@test.com')
const password = ref('admintest')

const emailRules = [
  (v: string) => !!v || 'Ce champ ne peut pas être vide.',
  (v: string) => /.+@.+\..+/.test(v) || "L'adresse email n'est pas valide.",
]

const { setAuthUser } = useAuthUserStore()

async function login() {
  if (validLoginForm.value) {
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
}
</script>

<template>
  <div>
    <RouterLink to="/">Retour à l’accueil</RouterLink>
  </div>

  <v-form v-model="validLoginForm" lazy-validation @submit.prevent="login">
    <v-container>
      <div class="flex flex-col w-[20vw]">
        <v-text-field
          v-model="email"
          label="Email"
          :rules="emailRules"
        ></v-text-field>

        <v-text-field
          v-model="password"
          :counter="10"
          label="Mot de passe"
          :rules="[(v) => !!v || 'Ce champ ne peut pas être vide.']"
        ></v-text-field>
      </div>
    </v-container>

    <v-card-actions>
      <v-btn type="submit">Se connecter</v-btn>
    </v-card-actions>
  </v-form>
</template>
