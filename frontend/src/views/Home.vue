<script setup lang="ts">
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'
import { Api, Resource } from '@/api/api'
import { onMounted, ref, computed } from 'vue'
import { useResourceHelpers } from '@/composables/useResourceHelpers'
import { useRouter } from 'vue-router'

// Store et état utilisateur
const { authUser, isAuthenticated } = storeToRefs(useAuthUserStore())
const router = useRouter()

// Composables
const {
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getCategoryDisplayName,
  getResourceIcon,
  getResourceColor,
  formatDate
} = useResourceHelpers()

// Gestion des ressources
const resources = ref<Resource[]>([])
const isLoading = ref(false)
const error = ref('')
const api = new Api()

// Computed pour 3 ressources aléatoires
const randomResources = computed(() => {
  if (resources.value.length === 0) return []
  
  // Filtrer seulement les ressources publiées
  const publishedResources = resources.value.filter(r => r.status === 'PUBLISHED')
  
  // Mélanger et prendre 3 ressources
  const shuffled = [...publishedResources].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})

// Statistiques des ressources
const resourcesStats = computed(() => ({
  total: resources.value.length,
  published: resources.value.filter(r => r.status === 'PUBLISHED').length,
}))

// Récupération des ressources
const fetchResources = async () => {
  isLoading.value = true
  error.value = ''
  try {
    // Utiliser l'endpoint public pour les ressources publiées
    const response = await api.get('resource/published')
    console.log('🔍 DEBUG - Resources response:', response)
    console.log('🔍 DEBUG - Response data:', response?.data)
    
    // Essayer différents formats de réponse
    let resourcesData = null
    const responseData = response as any
    
    // Format nouveau: { data: { ressource: [...] } } (selon votre diff)
    if (responseData?.data?.ressource) {
      resourcesData = Array.isArray(responseData.data.ressource) ? responseData.data.ressource : [responseData.data.ressource]
    }
    // Format nouveau: { data: { resources: [...] } }
    else if (responseData?.data?.resources) {
      resourcesData = Array.isArray(responseData.data.resources) ? responseData.data.resources : [responseData.data.resources]
    }
    // Format ancien: { data: [...] }
    else if (responseData?.data && Array.isArray(responseData.data)) {
      resourcesData = responseData.data
    }
    // Format direct: { ressource: [...] }
    else if (responseData?.ressource) {
      resourcesData = Array.isArray(responseData.ressource) ? responseData.ressource : [responseData.ressource]
    }
    // Format direct: { resources: [...] }
    else if (responseData?.resources) {
      resourcesData = Array.isArray(responseData.resources) ? responseData.resources : [responseData.resources]
    }
    // Format direct: [...]
    else if (Array.isArray(responseData)) {
      resourcesData = responseData
    }
    
    console.log('🔍 DEBUG - Parsed resourcesData:', resourcesData)
    
    if (!resourcesData) {
      console.log('⚠️ DEBUG - No resources found in response')
      resources.value = []
      return
    }
    
    resources.value = resourcesData.map((resourceData: any) => ({
      uuid: resourceData._id,
      title: resourceData.title || '',
      authorUuid: resourceData.authorId || '',
      contentGridfsUuid: resourceData.contentGridfsId || '',
      category: resourceData.category || '',
      status: resourceData.status || 'DRAFT',
      validatedAndPublishedAt: resourceData.validatedAndPublishedAt,
      validatedBy: resourceData.validatedBy,
      createdAt: resourceData.createdAt || '',
      updatedAt: resourceData.updatedAt || '',
    }))
    
    console.log('🔍 DEBUG - Final resources:', resources.value)
  } catch (err) {
    console.error('Erreur lors de la récupération des ressources:', err)
    error.value = 'Impossible de charger les ressources. Veuillez réessayer plus tard.'
  } finally {
    isLoading.value = false
  }
}

// Chargement des données au montage du composant
onMounted(() => {
  fetchResources()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-500/90 via-indigo-500/90 to-blue-600/90 px-8 py-20 text-white">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10 pointer-events-none">
        <div class="w-full h-full" style="background-image: url('data:image/svg+xml,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;><defs><pattern id=&quot;grain&quot; width=&quot;100&quot; height=&quot;100&quot; patternUnits=&quot;userSpaceOnUse&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;1&quot; fill=&quot;white&quot; opacity=&quot;0.1&quot;/></pattern></defs><rect width=&quot;100&quot; height=&quot;100&quot; fill=&quot;url(%23grain)&quot;/></svg>')"></div>
      </div>
      
      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h1 class="text-6xl lg:text-7xl font-bold mb-6">
          Bienvenue sur<br>
          <span class="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            (RE)SOURCES RELATIONNELLES
          </span>
        </h1>
        <p class="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed mb-8">
          Découvrez, partagez et explorez une collection de ressources pour améliorer vos relations et votre bien-être
        </p>
        
        <!-- Actions principales -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <v-btn
            class="rounded-full px-8 h-14 font-semibold tracking-wide"
            color="primary"
            size="large"
            elevation="4"
            @click="router.push('/resources')"
          >
            <v-icon start>mdi-library-books</v-icon>
            Explorer les ressources
          </v-btn>
          
          <v-btn
            v-if="isAuthenticated"
            class="rounded-full px-8 h-14 font-semibold tracking-wide"
            variant="outlined"
            color="white"
            size="large"
            @click="router.push('/create-resource')"
          >
            <v-icon start>mdi-plus-circle</v-icon>
            Créer une ressource
          </v-btn>
          
          <v-btn
            v-else
            class="rounded-full px-8 h-14 font-semibold tracking-wide"
            variant="outlined"
            color="white"
            size="large"
            @click="router.push('/login')"
          >
            <v-icon start>mdi-login</v-icon>
            Se connecter
          </v-btn>
        </div>
      </div>
    </div>

    <div class="relative z-20 -mt-8 bg-gray-50 rounded-t-3xl min-h-[calc(100vh-200px)] px-4 py-8">
      <!-- Informations utilisateur si connecté -->
      <div v-if="authUser" class="max-w-6xl mx-auto mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <v-icon color="white" size="32">mdi-account-circle</v-icon>
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">Bonjour {{ authUser?.username }} !</h2>
              <p class="text-gray-600">Rôle : {{ authUser?.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques rapides -->
      <div class="max-w-6xl mx-auto mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <v-icon color="white" size="32">mdi-library</v-icon>
              </div>
              <div>
                <div class="text-3xl font-bold text-gray-900">{{ resourcesStats.published }}</div>
                <div class="text-gray-600">Ressources disponibles</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl p-6 shadow-lg">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <v-icon color="white" size="32">mdi-account-group</v-icon>
              </div>
              <div>
                <div class="text-3xl font-bold text-gray-900">{{ isAuthenticated ? 'Connecté' : 'Visiteur' }}</div>
                <div class="text-gray-600">{{ isAuthenticated ? 'Peut créer des ressources' : 'Peut consulter les ressources' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des ressources aléatoires -->
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">Ressources à découvrir</h2>
              <p class="text-gray-600">Une sélection de ressources pour vous inspirer</p>
            </div>
            
            <v-btn
              variant="outlined"
              @click="fetchResources"
              :loading="isLoading"
              class="rounded-xl"
            >
              <v-icon start>mdi-refresh</v-icon>
              Actualiser
            </v-btn>
          </div>

          <!-- Affichage d'erreur -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div class="flex items-center gap-3">
              <v-icon color="red" size="24">mdi-alert-circle</v-icon>
              <p class="text-red-700">{{ error }}</p>
            </div>
          </div>

          <!-- État de chargement -->
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-gray-600">Chargement des ressources...</p>
          </div>
          
          <!-- Message si aucune ressource -->
          <div v-else-if="randomResources.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div class="mb-6">
              <v-icon size="80" color="grey-lighten-2">mdi-folder-open-outline</v-icon>
            </div>
            <h3 class="text-2xl font-semibold text-gray-700 mb-2">Aucune ressource disponible</h3>
            <p class="text-gray-600 mb-8">Il n'y a pas encore de ressources publiées.</p>
            
            <v-btn
              v-if="isAuthenticated"
              color="primary"
              @click="router.push('/create-resource')"
              class="rounded-xl font-medium"
            >
              <v-icon start>mdi-plus</v-icon>
              Créer la première ressource
            </v-btn>
          </div>
          
          <!-- Grille des ressources aléatoires -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="resource in randomResources"
              :key="resource.uuid"
              class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              @click="router.push('/resources')"
            >
              <!-- En-tête de la card -->
              <div class="p-6 pb-4">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <v-icon
                      :color="getResourceColor(resource.category)"
                      size="32"
                    >
                      {{ getResourceIcon(resource.category) }}
                    </v-icon>
                  </div>
                  
                  <v-chip
                    :color="getStatusColor(resource.status)"
                    size="small"
                    variant="flat"
                    class="font-medium"
                  >
                    <v-icon start size="16">{{ getStatusIcon(resource.status) }}</v-icon>
                    {{ getStatusText(resource.status) }}
                  </v-chip>
                </div>

                <!-- Contenu principal -->
                <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{{ resource.title }}</h3>
                
                <div class="mb-4">
                  <v-chip
                    :color="getResourceColor(resource.category)"
                    size="small"
                    variant="tonal"
                    class="font-medium"
                  >
                    {{ getCategoryDisplayName(resource.category) }}
                  </v-chip>
                </div>

                <div class="space-y-2 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <v-icon size="16" class="text-gray-400">mdi-calendar</v-icon>
                    <span>{{ resource.createdAt ? formatDate(resource.createdAt) : 'Date inconnue' }}</span>
                  </div>
                  
                  <div v-if="resource.validatedAndPublishedAt" class="flex items-center gap-2 text-green-600">
                    <v-icon size="16">mdi-check-circle</v-icon>
                    <span>Publié le {{ formatDate(resource.validatedAndPublishedAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <v-btn
                  variant="text"
                  color="primary"
                  block
                  class="rounded-xl font-medium"
                  @click.stop="router.push('/resources')"
                >
                  <v-icon start>mdi-eye</v-icon>
                  Voir toutes les ressources
                </v-btn>
              </div>
            </div>
          </div>

          <!-- Lien vers toutes les ressources -->
          <div v-if="randomResources.length > 0" class="text-center mt-8">
            <v-btn
              color="primary"
              size="large"
              @click="router.push('/resources')"
              class="rounded-xl font-medium"
            >
              <v-icon start>mdi-arrow-right</v-icon>
              Voir toutes les {{ resourcesStats.published }} ressources
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
