<script setup lang="ts">
import { roles } from '@/utils/roles'
import { ref } from 'vue'

defineProps({
  showUsername: {
    type: Boolean,
    default: false,
  },
  showEmail: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  showUpdatePassword: {
    type: Boolean,
    default: false,
  },
  showUpdatePasswordConfirmation: {
    type: Boolean,
    default: false,
  },
  showRole: {
    type: Boolean,
    default: false,
  },
  passwordLabel: {
    type: String,
    default: 'Mot de passe',
  },
  buttonText: {
    type: String,
    default: 'Sauvegarder',
  },
})

const username = defineModel('username')
const email = defineModel('email')
const password = defineModel('password')
const updatePassword = defineModel('updatePassword')
const updatePasswordConfirmation = defineModel('updatePasswordConfirmation')
const role = defineModel('role')

const validUserForm = ref(false)
const showPasswordCharacters = ref(false)
const emit = defineEmits(['save'])

const notNull = [(v: string) => !!v || 'Ce champ ne peut pas être vide.']

const userRules = [
  ...notNull,
  (v: string) =>
    v.length >= 5 || "Le nom d'utilisateur doit contenir au moins 5 caractères",
]

const emailRules = [
  ...notNull,
  (v: string) => /.+@.+\..+/.test(v) || "L'adresse email n'est pas valide.",
]

const passwordRules = [
  ...notNull,
  (v: string) =>
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(v) ||
    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial",
]

const updatePasswordRules = [
  ...passwordRules,
  (v: string) =>
    v !== password.value || 'Le nouveau mot de passe est identique à l’ancien.',
]

const updatePasswordConfirmationRules = [
  ...passwordRules,
  (v: string) =>
    v === updatePassword.value ||
    'Les nouveaux mots de passe saisis ne sont pas identiques.',
]

async function save() {
  if (!validUserForm.value) {
    return
  }
  emit('save')
}
</script>

<template> 
  <v-form v-model="validUserForm" lazy-validation @submit.prevent="save">
    <v-container>
      <div class="flex flex-col w-[20vw]">
        <v-text-field
          v-if="showUsername"
          v-model="username"
          label="Nom d'utilisateur"
          :rules="userRules"
        ></v-text-field>

        <v-text-field
          v-if="showEmail"
          v-model="email"
          label="Email"
          :rules="emailRules"
        ></v-text-field>

        <v-text-field
          v-if="showPassword"
          v-model="password"
          :label="passwordLabel"
          password
          :append-icon="showPasswordCharacters ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordCharacters ? 'text' : 'password'"
          :rules="passwordRules"
          hint="8 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial"
          persistent-hint
          @click:append="showPasswordCharacters = !showPasswordCharacters"
        ></v-text-field>

        <v-text-field
          v-if="showUpdatePassword"
          v-model="updatePassword"
          label="Nouveau mot de passe"
          password
          :append-icon="showPasswordCharacters ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordCharacters ? 'text' : 'password'"
          :rules="updatePasswordRules"
          hint="8 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial"
          persistent-hint
          @click:append="showPasswordCharacters = !showPasswordCharacters"
        ></v-text-field>

        <v-text-field
          v-if="showUpdatePasswordConfirmation"
          v-model="updatePasswordConfirmation"
          label="Confirmation du nouveau mot de passe"
          password
          :append-icon="showPasswordCharacters ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordCharacters ? 'text' : 'password'"
          :rules="updatePasswordConfirmationRules"
          hint="8 caractères minimum, 1 majuscule, 1 chiffre, 1 caractère spécial"
          persistent-hint
          @click:append="showPasswordCharacters = !showPasswordCharacters"
        ></v-text-field>

        <v-select
          v-if="showRole"
          v-model="role"
          :items="roles"
          label="Role"
          :rules="notNull"
        ></v-select>
      </div>
    </v-container>

    <v-card-actions>
      <v-btn type="submit">{{ buttonText }}</v-btn>
    </v-card-actions>
  </v-form>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
