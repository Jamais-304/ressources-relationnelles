<script setup lang="ts">
import { Api, User } from '@/api/api'
import { useErrorsManagement } from '@/composables/useErrorsManagement'
import router from '@/routes/router'
import { useAuthUserStore } from '@/stores/authUserStore'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()
const { setAuthUser } = useAuthUserStore()
const { handleError } = useErrorsManagement()

const email = ref('admintest@test.com')
const password = ref('Admin123!')
const isLoading = ref(false)
const showPassword = ref(false)

// Validation rules
const emailRules = [
  (v: string) => !!v || 'L\'email est requis',
  (v: string) => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
]

const passwordRules = [
  (v: string) => !!v || 'Le mot de passe est requis',
  (v: string) => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères'
]

async function login() {
  if (!email.value || !password.value) {
    toast.error('Veuillez remplir tous les champs')
    return
  }

  isLoading.value = true
  
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
    handleError(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-500/90 via-indigo-500/90 to-blue-600/90 px-8 py-16 text-white">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="w-full h-full" style="background-image: url('data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><defs><pattern id=&quot;grain&quot; width=&quot;100&quot; height=&quot;100&quot; patternUnits=&quot;userSpaceOnUse&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;1&quot; fill=&quot;white&quot; opacity=&quot;0.1&quot;/></pattern></defs><rect width=&quot;100&quot; height=&quot;100&quot; fill=&quot;url(%23grain)&quot;/></svg>')"></div>
      </div>
      
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <h1 class="flex items-center justify-center gap-4 text-5xl lg:text-6xl font-bold mb-4">
          <v-icon class="text-6xl lg:text-7xl">mdi-login</v-icon>
          Connexion
        </h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          Accédez à votre espace personnel et découvrez toutes les ressources relationnelles
        </p>
        
        <!-- Bouton retour -->
        <div class="mt-8">
          <v-btn
            variant="outlined"
            color="white"
            size="large"
            class="rounded-full px-8 h-14 font-semibold tracking-wide"
            @click="router.push('/')"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Retour à l'accueil
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Formulaire de connexion -->
    <div class="relative z-20 -mt-8 bg-gray-50 rounded-t-3xl min-h-[calc(100vh-200px)] px-4 py-8">
      <div class="max-w-md mx-auto">
        <!-- Carte de connexion moderne -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- En-tête de la carte -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4">
              <v-icon size="40">mdi-account-circle</v-icon>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Bon retour !</h2>
            <p class="text-gray-600">Connectez-vous à votre compte</p>
          </div>

          <!-- Formulaire -->
          <v-form @submit.prevent="login">
            <!-- Email -->
            <v-text-field
              v-model="email"
              label="Adresse email"
              type="email"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              placeholder="votre@email.com"
              :rules="emailRules"
              :disabled="isLoading"
              class="mb-4"
              color="primary"
            />

            <!-- Mot de passe -->
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Mot de passe"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              placeholder="Votre mot de passe"
              :rules="passwordRules"
              :disabled="isLoading"
              class="mb-6"
              color="primary"
              @click:append-inner="showPassword = !showPassword"
            />

            <!-- Bouton de connexion -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="isLoading"
              class="rounded-xl h-14 font-semibold tracking-wide"
            >
              <v-icon start>mdi-login</v-icon>
              Se connecter
            </v-btn>
          </v-form>
        </div>

        <!-- Liens supplémentaires -->
        <div class="text-center mt-8 space-y-4">
          <div class="text-gray-600">
            Pas encore de compte ? 
            <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">
              Contactez un administrateur
            </a>
          </div>
          
          <div class="text-sm text-gray-500">
            En vous connectant, vous acceptez nos conditions d'utilisation
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
