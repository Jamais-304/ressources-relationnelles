<script setup lang="ts">
import { Api, User, Role } from '@/api/api'
import { useErrorsManagement } from '@/composables/useErrorsManagement'
import { useUsersManagement } from '@/composables/useUsersManagement'
import { useResourcesManagement } from '@/composables/useResourcesManagement'
import { useResourceHelpers, type Resource } from '@/composables/useResourceHelpers'
import { useAuthUserStore } from '@/stores/authUserStore'
import ResourceDetailsModal from '@/components/resources/ResourceDetailsModal.vue'
import router from '@/routes/router'
import { onMounted, ref, computed } from 'vue'
import { toast } from 'vue3-toastify'

const api = new Api()
const apiBaseUrl = api.baseUrl

const {
  references: { users, currentUser },
} = useUsersManagement()

const {
  references: { resources, currentResource },
} = useResourcesManagement()

const { handleError } = useErrorsManagement()

const { authUser, isAuthenticated, isAdmin } = useAuthUserStore()

const {
  getStatusColor,
  getStatusIcon,
  getStatusText,
  getCategoryDisplayName,
  getResourceIcon,
  getResourceColor,
  formatDate
} = useResourceHelpers()

// État pour l'affichage
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('ALL')
const viewMode = ref<'grid' | 'list'>('grid')
const isLoading = ref(false)
const expandedCards = ref<Set<string>>(new Set())

// État pour les statistiques globales
const globalStats = ref({
  total: 0,
  published: 0,
  draft: 0,
  pending: 0,
})

// État pour les détails des ressources
const resourceContents = ref<Map<string, string>>(new Map())
const resourceContentTypes = ref<Map<string, string>>(new Map())
const loadingContents = ref<Set<string>>(new Set())

// État pour la modal de détails
const detailsModal = ref(false)
const selectedResourceForModal = ref<Resource | null>(null)

// Computed properties
const filteredResources = computed(() => {
  if (!resources.value) return []
  
  let filtered = resources.value as Resource[]

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(query)
    )
  }

  // Filtre par catégorie
  if (selectedCategory.value) {
    filtered = filtered.filter(resource => resource.category === selectedCategory.value)
  }

  // Filtre par statut
  if (selectedStatus.value !== 'ALL') {
    filtered = filtered.filter(resource => resource.status === selectedStatus.value)
  }

  return filtered
})

const resourcesCount = computed(() => ({
  total: globalStats.value.total,
  published: globalStats.value.published,
  draft: globalStats.value.draft,
  pending: globalStats.value.pending,
}))

// Méthodes
async function loadGlobalStats() {
  try {
    // Essayer de récupérer les statistiques globales si l'utilisateur est admin
    if (isAuthenticated && isAdmin) {
      try {
        const response = await api.resources.list()
        const allResources = response as Resource[]
        
        globalStats.value = {
          total: allResources.length,
          published: allResources.filter(r => r.status === 'PUBLISHED').length,
          draft: allResources.filter(r => r.status === 'DRAFT').length,
          pending: allResources.filter(r => r.status === 'PENDING').length,
        }
        return
      } catch (error) {
        console.warn('Erreur lors du chargement des statistiques admin, fallback vers endpoint public:', error)
        // Continuer avec l'endpoint public en cas d'erreur
      }
    }
    
    // Pour les visiteurs non connectés et les utilisateurs normaux, utiliser l'endpoint public
    const response = await api.get('resource/published')
    const publishedResources = response?.data as any[]
    
    globalStats.value = {
      total: publishedResources?.length || 0,
      published: publishedResources?.length || 0,
      draft: 0,
      pending: 0,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
    // En cas d'erreur, utiliser des valeurs par défaut
    globalStats.value = {
      total: 0,
      published: 0,
      draft: 0,
      pending: 0,
    }
  }
}

async function listResources() {
  isLoading.value = true
  try {
    // Charger les statistiques globales
    await loadGlobalStats()
    
    // Utiliser l'endpoint public pour l'affichage des ressources
    // Cet endpoint ne nécessite pas d'authentification
    const response = await api.get('resource/published')
    
    // Transformer les données en utilisant le bon mapping
    const resourcesData = response?.data as any[]
    resources.value = resourcesData?.map((resourceData: any) => ({
      uuid: resourceData._id,
      title: resourceData.title,
      authorUuid: resourceData.authorId,
      contentGridfsUuid: resourceData.contentGridfsId, // Mapping du nom de champ
      category: resourceData.category,
      status: resourceData.status,
      validatedAndPublishedAt: resourceData.validatedAndPublishedAt,
      validatedBy: resourceData.validatedBy,
      createdAt: resourceData.createdAt,
      updatedAt: resourceData.updatedAt,
    })) || []
    
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const toggleCardExpansion = async (resource: Resource) => {
  const isExpanded = expandedCards.value.has(resource.uuid)
  
  if (isExpanded) {
    expandedCards.value.delete(resource.uuid)
  } else {
    expandedCards.value.add(resource.uuid)
    // Charger le contenu si pas déjà chargé
    if (!resourceContents.value.has(resource.uuid)) {
      await loadResourceContent(resource)
    }
  }
}

const loadResourceContent = async (resource: Resource) => {
  if (loadingContents.value.has(resource.uuid)) return
  
  loadingContents.value.add(resource.uuid)
  
  try {
    // Utiliser la route publique pour les ressources publiées
    const resourceResponse = await api.get(`resource/published/${resource.uuid}`)
    const resourceData = resourceResponse.data as any
    
    if (resourceData && resourceData.resourceMIMEType) {
      resourceContentTypes.value.set(resource.uuid, resourceData.resourceMIMEType)
      
      // Si c'est du texte, essayer de récupérer le contenu
      if (resourceData.resourceMIMEType.startsWith('text/')) {
        try {
          // Utiliser l'endpoint public pour le contenu des ressources publiées
          const contentResponse = await api.get(`resource/published/${resource.uuid}/content`, {
            responseType: 'text'
          })
          const content = contentResponse.data || contentResponse
          resourceContents.value.set(resource.uuid, content as string)
        } catch (error: any) {
          console.error('Erreur lors du chargement du contenu:', error)
          resourceContents.value.set(resource.uuid, 'Contenu non disponible')
        }
      } else if (resourceData.resourceMIMEType.startsWith('image/')) {
        // Les images sont accessibles publiquement
        resourceContents.value.set(resource.uuid, `Image ${resourceData.resourceMIMEType}`)
      } else {
        resourceContents.value.set(resource.uuid, `Fichier ${resourceData.resourceMIMEType}`)
      }
    }
  } catch (error: any) {
    console.error('Erreur lors du chargement des métadonnées:', error)
    resourceContents.value.set(resource.uuid, 'Informations non disponibles')
  } finally {
    loadingContents.value.delete(resource.uuid)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const downloadResource = (resource: Resource) => {
  console.log('Télécharger:', resource)
  toast.info('Fonctionnalité de téléchargement à implémenter')
}

const openResourceModal = (resource: Resource) => {
  selectedResourceForModal.value = resource
  detailsModal.value = true
}

const categories = [
  'TEXT', 'IMAGE', 'VIDEO', 'AUDIO',
  'sante_mentale', 'sorties', 'bien_etre', 'support_communautaire',
  'ressources_professionnelles', 'formation', 'logement', 'famille_parentalite'
]

onMounted(() => listResources())
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
            <v-icon class="text-6xl lg:text-7xl">mdi-library-books</v-icon>
            Ressources Relationnelles
          </h1>
          <p class="text-xl opacity-90 max-w-2xl leading-relaxed">
            Découvrez une collection de ressources pour améliorer vos relations et votre bien-être
          </p>
        </div>
        
        <v-btn
          v-if="isAuthenticated"
          class="rounded-full px-8 h-14 font-semibold tracking-wide"
          color="primary"
          size="large"
          elevation="4"
          @click="router.push('/create-resource')"
        >
          <v-icon start>mdi-plus-circle</v-icon>
          Créer une ressource
        </v-btn>
        
        <v-btn
          v-else
          class="rounded-full px-8 h-14 font-semibold tracking-wide"
          color="primary"
          size="large"
          elevation="4"
          @click="router.push('/login')"
        >
          <v-icon start>mdi-login</v-icon>
          Se connecter
        </v-btn>
      </div>
    </div>

    <div class="relative z-20 -mt-8 bg-gray-50 rounded-t-3xl min-h-[calc(100vh-200px)] px-4 py-8">
      <!-- Statistiques modernes -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div class="w-15 h-15 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <v-icon size="24">mdi-library</v-icon>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ resourcesCount.total }}</div>
            <div class="text-sm text-gray-600">Total</div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div class="w-15 h-15 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
            <v-icon size="24">mdi-check-circle</v-icon>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ resourcesCount.published }}</div>
            <div class="text-sm text-gray-600">Publiées</div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div class="w-15 h-15 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
            <v-icon size="24">mdi-file-edit</v-icon>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ resourcesCount.draft }}</div>
            <div class="text-sm text-gray-600">Brouillons</div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div class="w-15 h-15 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
            <v-icon size="24">mdi-clock</v-icon>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ resourcesCount.pending }}</div>
            <div class="text-sm text-gray-600">En attente</div>
          </div>
        </div>
      </div>

      <!-- Filtres modernes -->
      <div class="mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1">
              <v-text-field
                v-model="searchQuery"
                placeholder="Rechercher des ressources..."
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                density="comfortable"
                clearable
                hide-details
                class="rounded-xl"
              />
            </div>

            <div class="flex flex-col lg:flex-row gap-4 lg:items-center">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                placeholder="Catégorie"
                prepend-inner-icon="mdi-tag"
                variant="solo"
                density="comfortable"
                clearable
                hide-details
                class="lg:w-48"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>{{ getCategoryDisplayName(item.raw) }}</v-list-item-title>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  {{ getCategoryDisplayName(item.raw) }}
                </template>
              </v-select>

              <v-select
                v-model="selectedStatus"
                :items="[
                  { value: 'ALL', title: 'Toutes les ressources' },
                  { value: 'PUBLISHED', title: 'Publiées' }
                ]"
                item-value="value"
                item-title="title"
                prepend-inner-icon="mdi-filter"
                variant="solo"
                density="comfortable"
                hide-details
                class="lg:w-48"
              />

              <div class="flex items-center gap-2">
                <v-btn-toggle v-model="viewMode" mandatory class="rounded-xl">
                  <v-btn value="grid" icon="mdi-view-grid" />
                  <v-btn value="list" icon="mdi-view-list" />
                </v-btn-toggle>
                
                <v-btn
                  variant="outlined"
                  @click="clearFilters"
                  class="rounded-xl"
                >
                  <v-icon start>mdi-filter-off</v-icon>
                  Effacer
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-gray-600">Chargement des ressources...</p>
      </div>

      <!-- Affichage des ressources -->
      <div v-else-if="filteredResources.length > 0">
        <!-- Vue grille moderne -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="resource in filteredResources"
            :key="resource.uuid"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            :class="{ 'ring-2 ring-indigo-500': expandedCards.has(resource.uuid) }"
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
                  <span>{{ formatDate(resource.createdAt) }}</span>
                </div>
                
                <div v-if="resource.validatedAndPublishedAt" class="flex items-center gap-2 text-green-600">
                  <v-icon size="16">mdi-check-circle</v-icon>
                  <span>Publié le {{ formatDate(resource.validatedAndPublishedAt) }}</span>
                </div>
              </div>

              <!-- Contenu étendu -->
              <div v-if="expandedCards.has(resource.uuid)" class="mt-6 pt-6 border-t border-gray-100">
                <!-- Aperçu du contenu -->
                <div>
                  <h4 class="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <v-icon size="20">mdi-eye</v-icon>
                    Aperçu du contenu
                  </h4>
                  
                  <div v-if="loadingContents.has(resource.uuid)" class="flex items-center gap-3 py-4">
                    <v-progress-circular indeterminate size="24" />
                    <span class="text-gray-600">Chargement...</span>
                  </div>
                  
                  <div v-else-if="resourceContents.has(resource.uuid)" class="max-h-75 overflow-y-auto">
                    <!-- Contenu texte/HTML -->
                    <div v-if="resourceContentTypes.get(resource.uuid)?.startsWith('text/')">
                      <div v-if="resourceContentTypes.get(resource.uuid) === 'text/html'" 
                           v-html="resourceContents.get(resource.uuid)" 
                           class="prose prose-sm max-w-none">
                      </div>
                      <div v-else class="whitespace-pre-wrap leading-relaxed text-gray-700">
                        {{ resourceContents.get(resource.uuid) }}
                      </div>
                    </div>
                    
                    <!-- Contenu image -->
                    <div v-else-if="resourceContentTypes.get(resource.uuid)?.startsWith('image/')">
                      <img 
                        :src="`${apiBaseUrl}/resource/image/${resource.contentGridfsUuid}`"
                        class="w-full max-h-50 object-contain rounded-xl"
                        @error="($event.target as HTMLImageElement).style.display = 'none'"
                      />
                    </div>
                    
                    <!-- Autres types -->
                    <div v-else class="flex items-center gap-2 p-4 bg-gray-50 rounded-xl text-gray-600">
                      <v-icon>mdi-file</v-icon>
                      <span>{{ resourceContents.get(resource.uuid) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
              <v-btn
                variant="text"
                color="primary"
                @click="toggleCardExpansion(resource)"
                class="rounded-xl font-medium"
              >
                <v-icon :class="{ 'rotate-180': expandedCards.has(resource.uuid) }" class="transition-transform duration-300">
                  {{ expandedCards.has(resource.uuid) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
                {{ expandedCards.has(resource.uuid) ? 'Réduire' : 'Voir détails' }}
              </v-btn>
              
              <v-btn
                variant="text"
                color="info"
                @click="openResourceModal(resource)"
                class="rounded-xl font-medium"
              >
                <v-icon start>mdi-open-in-new</v-icon>
                Ouvrir en grand
              </v-btn>
              
              <v-btn
                variant="text"
                color="secondary"
                @click="downloadResource(resource)"
                class="rounded-xl font-medium"
              >
                <v-icon start>mdi-download</v-icon>
                Télécharger
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Vue liste moderne -->
        <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            v-for="resource in filteredResources"
            :key="resource.uuid"
            class="cursor-pointer transition-colors duration-200 hover:bg-gray-50"
            @click="toggleCardExpansion(resource)"
          >
            <div class="p-6 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                <v-icon
                  :color="getResourceColor(resource.category)"
                  size="28"
                >
                  {{ getResourceIcon(resource.category) }}
                </v-icon>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 gap-2">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ resource.title }}</h3>
                  <v-chip
                    :color="getStatusColor(resource.status)"
                    size="small"
                    variant="flat"
                    class="self-start lg:self-center"
                  >
                    {{ getStatusText(resource.status) }}
                  </v-chip>
                </div>
                
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span>{{ getCategoryDisplayName(resource.category) }}</span>
                  <span class="opacity-50">•</span>
                  <span>{{ formatDate(resource.createdAt) }}</span>
                </div>
              </div>

              <div class="flex items-center gap-1">
                <v-btn
                  variant="text"
                  color="primary"
                  density="compact"
                  @click.stop="downloadResource(resource)"
                  class="rounded-xl"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                
                <v-btn
                  variant="text"
                  color="info"
                  density="compact"
                  @click.stop="openResourceModal(resource)"
                  class="rounded-xl"
                >
                  <v-icon>mdi-open-in-new</v-icon>
                  <v-tooltip activator="parent">Ouvrir en grand</v-tooltip>
                </v-btn>
                
                <v-btn
                  variant="text"
                  color="primary"
                  density="compact"
                  class="rounded-xl"
                >
                  <v-icon :class="{ 'rotate-180': expandedCards.has(resource.uuid) }" class="transition-transform duration-300">
                    {{ expandedCards.has(resource.uuid) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
              </div>
            </div>

            <!-- Contenu étendu pour la vue liste -->
            <div v-if="expandedCards.has(resource.uuid)" class="bg-gray-50 border-t border-gray-100">
              <div class="p-6">
                <!-- Même contenu que la vue grille -->
                <div v-if="loadingContents.has(resource.uuid)" class="flex items-center gap-3 py-4">
                  <v-progress-circular indeterminate size="24" />
                  <span class="text-gray-600">Chargement...</span>
                </div>
                
                <div v-else-if="resourceContents.has(resource.uuid)" class="max-h-75 overflow-y-auto">
                  <div v-if="resourceContentTypes.get(resource.uuid)?.startsWith('text/')">
                    <div v-if="resourceContentTypes.get(resource.uuid) === 'text/html'" 
                         v-html="resourceContents.get(resource.uuid)" 
                         class="prose prose-sm max-w-none">
                    </div>
                    <div v-else class="whitespace-pre-wrap leading-relaxed text-gray-700">
                      {{ resourceContents.get(resource.uuid) }}
                    </div>
                  </div>
                  
                  <div v-else-if="resourceContentTypes.get(resource.uuid)?.startsWith('image/')">
                    <img 
                      :src="`${apiBaseUrl}/resource/image/${resource.contentGridfsUuid}`"
                      class="w-full max-h-50 object-contain rounded-xl"
                      @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />
                  </div>
                  
                  <div v-else class="flex items-center gap-2 p-4 bg-white rounded-xl text-gray-600">
                    <v-icon>mdi-file</v-icon>
                    <span>{{ resourceContents.get(resource.uuid) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune ressource trouvée -->
      <div v-else class="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div class="mb-6">
          <v-icon size="80" color="grey-lighten-2">mdi-folder-open-outline</v-icon>
        </div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Aucune ressource trouvée</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          {{ searchQuery || selectedCategory 
             ? 'Essayez de modifier vos critères de recherche.' 
             : 'Il n\'y a pas encore de ressources.' }}
        </p>
        
        <div class="flex flex-wrap gap-4 justify-center">
          <v-btn
            v-if="searchQuery || selectedCategory"
            variant="outlined"
            @click="clearFilters"
            class="rounded-xl font-medium"
          >
            <v-icon start>mdi-filter-off</v-icon>
            Effacer les filtres
          </v-btn>
          
          <v-btn
            v-if="isAuthenticated"
            color="primary"
            @click="router.push('/resources/create')"
            class="rounded-xl font-medium"
          >
            <v-icon start>mdi-plus</v-icon>
            Créer la première ressource
          </v-btn>
          
          <v-btn
            v-else
            color="primary"
            @click="router.push('/login')"
            class="rounded-xl font-medium"
          >
            <v-icon start>mdi-login</v-icon>
            Se connecter pour créer
          </v-btn>
        </div>
      </div>
    </div>
    
    <!-- Modal de détails -->
    <ResourceDetailsModal
      v-model="detailsModal"
      :resource="selectedResourceForModal"
    />
  </div>
</template>
