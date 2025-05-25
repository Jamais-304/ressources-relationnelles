<script setup lang="ts">
import { Api, RelationType } from '@/api/api'
import ResourceForm from '@/components/ResourceForm.vue'
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const api = new Api()
const router = useRouter()

const { authUser, isAuthenticated } = storeToRefs(useAuthUserStore())

const title = ref('')
const relationType = ref<RelationType>()
const category = ref('')
const file = ref<File>()
const content = ref('')
const isLoading = ref(false)

// Vérifier l'authentification au montage
onMounted(() => {
  if (!isAuthenticated.value) {
    toast.error('Vous devez être connecté pour créer une ressource')
    router.push('/login')
  }
})

async function createResource() {
  if (!authUser.value?.uuid) {
    toast.error('Vous devez être connecté pour créer une ressource')
    return
  }

  isLoading.value = true

  try {
    const attrs = {
      authorUuid: authUser.value.uuid,
      title: title.value,
      relationType: relationType.value,
      category: category.value,
      file: file.value,
      content: content.value,
      status: 'DRAFT' as const,
    }

    const newResource = await api.resources.create(attrs)
    
    toast.success('🎉 Ressource créée avec succès!')
    
    // Redirection vers la liste des ressources ou la ressource créée
    router.push('/resources')
    
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    toast.error('❌ Erreur lors de la création de la ressource')
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
      
      <div class="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
        <div class="text-center lg:text-left">
          <h1 class="flex items-center justify-center lg:justify-start gap-4 text-5xl lg:text-6xl font-bold mb-4">
            <v-icon class="text-6xl lg:text-7xl">mdi-plus-circle</v-icon>
            Créer une Ressource
          </h1>
          <p class="text-xl opacity-90 max-w-2xl leading-relaxed">
            Partagez vos connaissances, expériences ou outils utiles avec la communauté
          </p>
        </div>
        
        <v-btn
          class="rounded-full px-8 h-14 font-semibold tracking-wide"
          color="primary"
          size="large"
          elevation="4"
          @click="router.push('/resources')"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          Retour aux ressources
        </v-btn>
      </div>
    </div>

    <div class="relative z-20 -mt-8 bg-gray-50 rounded-t-3xl min-h-[calc(100vh-200px)] px-4 py-8">
      <!-- Formulaire dans une carte moderne -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Barre de progression -->
          <div v-if="isLoading" class="h-1 bg-gray-200">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>
          </div>
          
          <!-- En-tête de la carte -->
          <div class="p-6 pb-4 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <v-icon color="white" size="24">mdi-file-plus</v-icon>
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-gray-900">Nouvelle ressource</h2>
                <p class="text-gray-600">Remplissez les informations ci-dessous</p>
              </div>
            </div>
          </div>
          
          <!-- Contenu du formulaire -->
          <div class="p-6">
            <ResourceForm
              v-model:title="title"
              v-model:relation-type="relationType"
              v-model:category="category"
              v-model:file="file"
              v-model:content="content"
              button-text="🚀 Créer la ressource"
              :disabled="isLoading"
              @save="createResource"
            />
          </div>
        </div>

        <!-- Conseils et aide -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <v-icon color="blue" size="20">mdi-lightbulb</v-icon>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Conseils pour une bonne ressource</h3>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• Choisissez un titre clair et descriptif</li>
                  <li>• Sélectionnez la catégorie appropriée</li>
                  <li>• Ajoutez une description détaillée</li>
                  <li>• Vérifiez la qualité de votre contenu</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <v-icon color="green" size="20">mdi-information</v-icon>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">Processus de validation</h3>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>• Votre ressource sera sauvée en brouillon</li>
                  <li>• Elle sera ensuite soumise à modération</li>
                  <li>• Une fois validée, elle sera publiée</li>
                  <li>• Vous recevrez une notification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
