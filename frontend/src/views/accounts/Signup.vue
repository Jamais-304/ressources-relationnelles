<script setup lang="ts">
import { Api, Role, User } from '@/api/api'
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
const confirmPassword = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation rules
const usernameRules = [
  (v: string) => !!v || 'Le nom d\'utilisateur est requis',
  (v: string) => v.length >= 3 || 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
  (v: string) => v.length <= 20 || 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères'
]

const emailRules = [
  (v: string) => !!v || 'L\'email est requis',
  (v: string) => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
]

const passwordRules = [
  (v: string) => !!v || 'Le mot de passe est requis',
  (v: string) => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères',
  (v: string) => /(?=.*[a-z])/.test(v) || 'Le mot de passe doit contenir au moins une minuscule',
  (v: string) => /(?=.*[A-Z])/.test(v) || 'Le mot de passe doit contenir au moins une majuscule',
  (v: string) => /(?=.*\d)/.test(v) || 'Le mot de passe doit contenir au moins un chiffre'
]

const confirmPasswordRules = [
  (v: string) => !!v || 'La confirmation du mot de passe est requise',
  (v: string) => v === password.value || 'Les mots de passe ne correspondent pas'
]

async function signup() {
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    toast.error('Veuillez remplir tous les champs')
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Les mots de passe ne correspondent pas')
    return
  }

  isLoading.value = true

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
      toast.success(`Bienvenue ${response.username} ! Votre compte a été créé avec succès.`)
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
          <v-icon class="text-6xl lg:text-7xl">mdi-account-plus</v-icon>
          Inscription
        </h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          Rejoignez notre communauté et accédez à toutes les ressources relationnelles
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

    <!-- Formulaire d'inscription -->
    <div class="relative z-20 -mt-8 bg-gray-50 rounded-t-3xl min-h-[calc(100vh-200px)] px-4 py-8">
      <div class="max-w-md mx-auto">
        <!-- Carte d'inscription moderne -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- En-tête de la carte -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mx-auto mb-4">
              <v-icon size="40">mdi-account-plus</v-icon>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
            <p class="text-gray-600">Rejoignez notre communauté dès maintenant</p>
          </div>

          <!-- Formulaire -->
          <v-form @submit.prevent="signup">
            <!-- Nom d'utilisateur -->
            <v-text-field
              v-model="username"
              label="Nom d'utilisateur"
              variant="outlined"
              prepend-inner-icon="mdi-account"
              placeholder="Votre nom d'utilisateur"
              :rules="usernameRules"
              :disabled="isLoading"
              class="mb-4"
              color="primary"
            />

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
              class="mb-4"
              color="primary"
              @click:append-inner="showPassword = !showPassword"
            />

            <!-- Confirmation mot de passe -->
            <v-text-field
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirmer le mot de passe"
              variant="outlined"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              placeholder="Confirmez votre mot de passe"
              :rules="confirmPasswordRules"
              :disabled="isLoading"
              class="mb-6"
              color="primary"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
            />

            <!-- Exigences du mot de passe -->
            <div class="mb-6 p-4 bg-gray-50 rounded-xl">
              <div class="text-sm text-gray-700">
                <div class="font-semibold mb-2 flex items-center">
                  <v-icon size="16" class="mr-2">mdi-shield-check</v-icon>
                  Exigences du mot de passe
                </div>
                <ul class="space-y-1 text-gray-600">
                  <li class="flex items-center">
                    <v-icon size="12" class="mr-2" :color="password.length >= 6 ? 'success' : 'grey'">
                      {{ password.length >= 6 ? 'mdi-check' : 'mdi-circle-small' }}
                    </v-icon>
                    Au moins 6 caractères
                  </li>
                  <li class="flex items-center">
                    <v-icon size="12" class="mr-2" :color="/(?=.*[a-z])/.test(password) ? 'success' : 'grey'">
                      {{ /(?=.*[a-z])/.test(password) ? 'mdi-check' : 'mdi-circle-small' }}
                    </v-icon>
                    Une lettre minuscule
                  </li>
                  <li class="flex items-center">
                    <v-icon size="12" class="mr-2" :color="/(?=.*[A-Z])/.test(password) ? 'success' : 'grey'">
                      {{ /(?=.*[A-Z])/.test(password) ? 'mdi-check' : 'mdi-circle-small' }}
                    </v-icon>
                    Une lettre majuscule
                  </li>
                  <li class="flex items-center">
                    <v-icon size="12" class="mr-2" :color="/(?=.*\d)/.test(password) ? 'success' : 'grey'">
                      {{ /(?=.*\d)/.test(password) ? 'mdi-check' : 'mdi-circle-small' }}
                    </v-icon>
                    Un chiffre
                  </li>
                </ul>
              </div>
            </div>

            <!-- Bouton d'inscription -->
            <v-btn
              type="submit"
              color="success"
              size="large"
              block
              :loading="isLoading"
              class="rounded-xl h-14 font-semibold tracking-wide"
            >
              <v-icon start>mdi-account-plus</v-icon>
              Créer mon compte
            </v-btn>
          </v-form>
        </div>

        <!-- Liens supplémentaires -->
        <div class="text-center mt-8 space-y-4">
          <div class="text-gray-600">
            Vous avez déjà un compte ? 
            <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
              Se connecter
            </router-link>
          </div>
          
          <div class="text-sm text-gray-500">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
