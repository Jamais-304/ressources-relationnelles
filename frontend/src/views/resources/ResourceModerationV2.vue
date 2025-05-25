<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Api } from '@/api/api'
import { useErrorsManagement } from '@/composables/useErrorsManagement'
import { useResourceHelpers, type Resource } from '@/composables/useResourceHelpers'
import { toast } from 'vue3-toastify'

// Components
import ResourceStatisticsCards from '@/components/resources/ResourceStatisticsCards.vue'
import ResourceFilters from '@/components/resources/ResourceFilters.vue'
import ResourceDetailsModal from '@/components/resources/ResourceDetailsModal.vue'

// Composables
const api = new Api()
const router = useRouter()
const { handleError } = useErrorsManagement()
const { 
  getStatusColor, 
  getStatusIcon, 
  getStatusText, 
  getCategoryDisplayName, 
  getResourceIcon, 
  getResourceColor, 
  formatDate 
} = useResourceHelpers()

// State
const resources = ref<Resource[]>([])
const isLoading = ref(false)
const selectedStatus = ref('PENDING')
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Dialog states
const confirmDialog = ref(false)
const selectedResource = ref<Resource | null>(null)
const newStatus = ref('')

// Modal details states
const detailsDialog = ref(false)
const resourceForDetails = ref<Resource | null>(null)

// Computed
const filteredResources = computed(() => {
  let filtered = resources.value

  if (selectedStatus.value !== 'ALL') {
    filtered = filtered.filter(resource => resource.status === selectedStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(query)
    )
  }

  return filtered
})

const resourcesCount = computed(() => ({
  total: resources.value.length,
  published: resources.value.filter(r => r.status === 'PUBLISHED').length,
  draft: resources.value.filter(r => r.status === 'DRAFT').length,
  pending: resources.value.filter(r => r.status === 'PENDING').length,
}))

// Methods
const loadResources = async () => {
  isLoading.value = true
  try {
    const response = await api.resources.list()
    resources.value = response as Resource[]
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

const openStatusDialog = (resource: Resource, status: string) => {
  selectedResource.value = resource
  newStatus.value = status
  confirmDialog.value = true
}

const updateResourceStatus = async () => {
  if (!selectedResource.value) return

  try {
    await api.put(`resource/${selectedResource.value.uuid}/status`, {
      status: newStatus.value
    })
    
    toast.success(`Ressource ${newStatus.value === 'PUBLISHED' ? 'publiée' : 'mise à jour'} avec succès`)
    await loadResources()
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    toast.error(`Erreur lors de la mise à jour: ${errorMessage}`)
  } finally {
    confirmDialog.value = false
    selectedResource.value = null
  }
}

const viewResource = (resource: Resource) => {
  router.push(`/resources/${resource.uuid}`)
}

const openResourceDetails = (resource: Resource) => {
  resourceForDetails.value = resource
  detailsDialog.value = true
}

const updateResourceStatusFromModal = async (resource: Resource, status: string) => {
  selectedResource.value = resource
  newStatus.value = status
  detailsDialog.value = false // Fermer la modal de détails
  confirmDialog.value = true  // Ouvrir la modal de confirmation
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'ALL'
}

// Lifecycle
onMounted(() => {
  loadResources()
})
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
            <v-icon class="text-6xl lg:text-7xl">mdi-shield-check</v-icon>
        Modération des Ressources
      </h1>
          <p class="text-xl opacity-90 max-w-2xl leading-relaxed">
        Gérez et validez les ressources en attente de publication
      </p>
    </div>

        <v-btn
          class="rounded-full px-8 h-14 font-semibold tracking-wide"
          color="primary"
          size="large"
          elevation="4"
          @click="router.push('/create-resource')"
        >
          <v-icon start>mdi-plus-circle</v-icon>
          Créer une ressource
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
                v-model="selectedStatus"
                :items="[
                  { value: 'ALL', title: 'Tous les statuts' },
                  { value: 'PENDING', title: 'En attente' },
                  { value: 'PUBLISHED', title: 'Publiées' },
                  { value: 'DRAFT', title: 'Brouillons' }
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
            </div>

            <!-- Actions de modération -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div class="flex flex-wrap gap-2 mb-3">
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  @click="openResourceDetails(resource)"
                  class="rounded-xl font-medium"
                >
                  <v-icon start size="16">mdi-eye</v-icon>
                  Détails
                </v-btn>

                <v-btn
                  v-if="resource.status !== 'PUBLISHED'"
                  variant="text"
                  color="success"
                  size="small"
                  @click="openStatusDialog(resource, 'PUBLISHED')"
                  class="rounded-xl font-medium"
                >
                  <v-icon start size="16">mdi-check</v-icon>
                  Publier
                </v-btn>

                <v-btn
                  v-if="resource.status === 'DRAFT'"
                  variant="text"
                  color="warning"
                  size="small"
                  @click="openStatusDialog(resource, 'PENDING')"
                  class="rounded-xl font-medium"
                >
                  <v-icon start size="16">mdi-clock</v-icon>
                  En attente
                </v-btn>

                <v-btn
                  v-if="resource.status !== 'DRAFT'"
                  variant="text"
                  color="info"
            size="small"
                  @click="openStatusDialog(resource, 'DRAFT')"
                  class="rounded-xl font-medium"
                >
                  <v-icon start size="16">mdi-file-edit</v-icon>
                  Brouillon
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue liste moderne -->
        <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            v-for="resource in filteredResources"
            :key="resource.uuid"
            class="border-b border-gray-100 last:border-b-0"
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
                    <v-icon start size="16">{{ getStatusIcon(resource.status) }}</v-icon>
                    {{ getStatusText(resource.status) }}
          </v-chip>
                </div>
                
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <v-chip
                      :color="getResourceColor(resource.category)"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ getCategoryDisplayName(resource.category) }}
                    </v-chip>
                  </div>
                  <span class="opacity-50">•</span>
                  <span>{{ formatDate(resource.createdAt) }}</span>
                </div>
              </div>

              <div class="flex items-center gap-1">
            <v-btn
              variant="text"
              color="primary"
                  density="compact"
                  @click="openResourceDetails(resource)"
                  class="rounded-xl"
            >
              <v-icon>mdi-eye</v-icon>
              <v-tooltip activator="parent">Voir détails</v-tooltip>
            </v-btn>

            <v-btn
                  v-if="resource.status !== 'PUBLISHED'"
              variant="text"
              color="success"
                  density="compact"
                  @click="openStatusDialog(resource, 'PUBLISHED')"
                  class="rounded-xl"
            >
              <v-icon>mdi-check</v-icon>
              <v-tooltip activator="parent">Publier</v-tooltip>
            </v-btn>

            <v-btn
                  v-if="resource.status === 'DRAFT'"
              variant="text"
              color="warning"
                  density="compact"
                  @click="openStatusDialog(resource, 'PENDING')"
                  class="rounded-xl"
            >
              <v-icon>mdi-clock</v-icon>
              <v-tooltip activator="parent">Mettre en attente</v-tooltip>
            </v-btn>

            <v-btn
                  v-if="resource.status !== 'DRAFT'"
              variant="text"
              color="info"
                  density="compact"
                  @click="openStatusDialog(resource, 'DRAFT')"
                  class="rounded-xl"
            >
              <v-icon>mdi-file-edit</v-icon>
              <v-tooltip activator="parent">Remettre en brouillon</v-tooltip>
            </v-btn>
          </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucune ressource trouvée -->
      <div v-else class="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div class="mb-6">
          <v-icon size="80" color="grey-lighten-2">mdi-shield-search</v-icon>
        </div>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Aucune ressource trouvée</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          {{ searchQuery || selectedStatus !== 'ALL'
             ? 'Essayez de modifier vos critères de recherche.' 
             : 'Il n\'y a pas encore de ressources à modérer.' }}
        </p>
        
        <div class="flex flex-wrap gap-4 justify-center">
          <v-btn
            v-if="searchQuery || selectedStatus !== 'ALL'"
            variant="outlined"
            @click="clearFilters"
            class="rounded-xl font-medium"
          >
            <v-icon start>mdi-filter-off</v-icon>
            Effacer les filtres
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Dialog de confirmation -->
    <v-dialog v-model="confirmDialog" max-width="500">
      <v-card class="rounded-2xl">
        <v-card-title class="text-xl font-semibold p-6 pb-4">
          Confirmation de changement de statut
        </v-card-title>
        
        <v-card-text class="px-6">
          <p class="text-gray-700 mb-4">Êtes-vous sûr de vouloir changer le statut de cette ressource ?</p>
          
          <div v-if="selectedResource" class="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div class="space-y-2">
              <div><strong class="text-gray-900">Ressource :</strong> <span class="text-gray-700">{{ selectedResource.title }}</span></div>
              <div><strong class="text-gray-900">Nouveau statut :</strong> 
                <v-chip
                  :color="getStatusColor(newStatus)"
                  size="small"
                  variant="flat"
                  class="ml-2"
                >
                  {{ getStatusText(newStatus) }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="p-6 pt-4">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="confirmDialog = false"
            class="rounded-xl font-medium"
          >
            Annuler
          </v-btn>
          <v-btn
            :color="getStatusColor(newStatus)"
            @click="updateResourceStatus"
            class="rounded-xl font-medium"
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de détails -->
    <ResourceDetailsModal
      v-model="detailsDialog"
      :resource="resourceForDetails"
      @update-status="updateResourceStatusFromModal"
    />
  </div>
</template>