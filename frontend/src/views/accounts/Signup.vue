<script setup lang="ts">
import { Api, Role, User } from '@/api/api'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()

const validSignupForm = ref(false)

const showPassword = ref(false)

const { setAuthUser } = useAuthUserStore()

const username = ref('')
const email = ref('')
const password = ref('')

const notNull = [(v: string) => !!v || 'Ce champ ne peut pas être vide.']

const userRules = [
  ...notNull,
  (v: string) =>
    v.length >= 5 || 'Le nom d’utilisateur doit contenir au moins 5 caractères',
]

const emailRules = [
  ...notNull,
  (v: string) => /.+@.+\..+/.test(v) || "L'adresse email n'est pas valide.",
]

const passwordRules = [
  ...notNull,
  (v: string) =>
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v) ||
    'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial',
]

async function signup() {
  if (!validSignupForm.value) {
    return
  }

  console.log(validSignupForm)

  const attrs = {
    username: username.value,
    email: email.value,
    password: password.value,
    role: Role.User,
  }

  const JSONattrs = User.toJson(attrs)
  console.log(JSONattrs)

  try {
    const response = await api.users.create(JSONattrs)
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
  <v-form v-model="validSignupForm" lazy-validation @submit.prevent="signup">
    <v-container>
      <div class="flex flex-col w-[20vw]">
        <v-text-field
          v-model="username"
          label="Nom d’utilisateur"
          :rules="userRules"
        ></v-text-field>

        <v-text-field
          v-model="email"
          label="Email"
          :rules="emailRules"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Mot de passe"
          password
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :rules="passwordRules"
          hint="8 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial"
          persistent-hint
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </div>
    </v-container>

    <v-card-actions>
      <v-btn type="submit">Créer mon compte</v-btn>
    </v-card-actions>
  </v-form>
</template>
