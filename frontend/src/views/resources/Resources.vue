<script setup lang="ts">
import { Api, User } from '@/api/api'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useErrorsManagement } from '@/composables/useErrorsManagement'
import { useUsersManagement } from '@/composables/useUsersManagement'
import { useResourcesManagement } from '@/composables/useResourcesManagement'
import router from '@/routes/router'
import { onMounted, ref, computed } from 'vue'
import { toast } from 'vue3-toastify'

// Interface pour les ressources selon votre structure
interface Resource {
  uuid: string
  title: string
  authorUuid: string
  contentGridfsUuid: string
  category: string
  status: string
  validatedAndPublishedAt?: string | undefined
  validatedBy?: number | undefined
  createdAt: string
  updatedAt: string
}

const api = new Api()

const {
  references: { users, currentUser },
} = useUsersManagement()

const {
  references: { resources, currentResource },
} = useResourcesManagement()

const { handleError } = useErrorsManagement()

const confirmationModalVisible = ref(false)
const confirmationModalMessage = ref('')

// Nouvel état pour l'affichage
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('PUBLISHED')
const viewMode = ref<'grid' | 'list'>('grid')
const isLoading = ref(false)

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
  total: filteredResources.value.length,
  published: filteredResources.value.filter(r => r.status === 'PUBLISHED').length,
  draft: filteredResources.value.filter(r => r.status === 'DRAFT').length,
  pending: filteredResources.value.filter(r => r.status === 'PENDING').length,
}))

// Méthodes utilitaires
const getResourceIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'text': return 'mdi-text-box'
    case 'image': return 'mdi-image'
    case 'video': return 'mdi-video'
    case 'audio': return 'mdi-music'
    case 'sante_mentale': return 'mdi-heart-pulse'
    case 'sorties': return 'mdi-calendar-star'
    case 'bien_etre': return 'mdi-spa'
    case 'support_communautaire': return 'mdi-account-group'
    case 'ressources_professionnelles': return 'mdi-briefcase'
    case 'formation': return 'mdi-school'
    case 'logement': return 'mdi-home'
    case 'famille_parentalite': return 'mdi-baby-face'
    default: return 'mdi-file'
  }
}

const getResourceColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'text': return 'blue'
    case 'image': return 'green'
    case 'video': return 'red'
    case 'audio': return 'purple'
    case 'sante_mentale': return 'pink'
    case 'sorties': return 'orange'
    case 'bien_etre': return 'teal'
    case 'support_communautaire': return 'indigo'
    case 'ressources_professionnelles': return 'brown'
    case 'formation': return 'cyan'
    case 'logement': return 'amber'
    case 'famille_parentalite': return 'deep-purple'
    default: return 'grey'
  }
}

const getCategoryDisplayName = (categoryName: string) => {
  const categoryNames: Record<string, string> = {
    'TEXT': 'Texte',
    'IMAGE': 'Image',
    'VIDEO': 'Vidéo',
    'AUDIO': 'Audio',
    'sante_mentale': 'Santé mentale',
    'sorties': 'Sorties',
    'bien_etre': 'Bien-être',
    'support_communautaire': 'Support communautaire',
    'ressources_professionnelles': 'Ressources professionnelles',
    'formation': 'Formation',
    'logement': 'Logement',
    'famille_parentalite': 'Famille & Parentalité'
  }
  return categoryNames[categoryName] || categoryName
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'success'
    case 'PENDING': return 'warning'
    case 'DRAFT': return 'info'
    default: return 'grey'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'Publié'
    case 'PENDING': return 'En attente'
    case 'DRAFT': return 'Brouillon'
    default: return status
  }
}

// Méthodes
async function listResources() {
  isLoading.value = true
  try {
    const response = await api.resources.list()
    resources.value = response
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

function showResource(resource: Resource) {
  currentResource.value = resource
  router.push(`/resources/${resource.uuid}`)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
}

const downloadResource = (resource: Resource) => {
  // TODO: Implémenter le téléchargement
  console.log('Télécharger:', resource)
  toast.info('Fonctionnalité de téléchargement à implémenter')
}

const categories = [
  'TEXT', 'IMAGE', 'VIDEO', 'AUDIO',
  'sante_mentale', 'sorties', 'bien_etre', 'support_communautaire',
  'ressources_professionnelles', 'formation', 'logement', 'famille_parentalite'
]

onMounted(() => listResources())
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- En-tête -->
    <div class="mb-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h1 class="text-h4 font-weight-bold text-primary mb-2">
            <v-icon class="mr-3" size="large">mdi-library-books</v-icon>
            Ressources Relationnelles
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Découvrez et gérez les ressources disponibles
          </p>
        </div>
        
        <v-btn
          color="primary"
          size="large"
          @click="router.push('/resources/create')"
          prepend-icon="mdi-plus"
        >
          Créer une ressource
        </v-btn>
      </div>

      <!-- Statistiques -->
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="primary" variant="tonal">
            <div class="text-h4 font-weight-bold">{{ resourcesCount.total }}</div>
            <div class="text-caption">Total</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="success" variant="tonal">
            <div class="text-h4 font-weight-bold">{{ resourcesCount.published }}</div>
            <div class="text-caption">Publiées</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="info" variant="tonal">
            <div class="text-h4 font-weight-bold">{{ resourcesCount.draft }}</div>
            <div class="text-caption">Brouillons</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="warning" variant="tonal">
            <div class="text-h4 font-weight-bold">{{ resourcesCount.pending }}</div>
            <div class="text-caption">En attente</div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Filtres et recherche -->
    <v-card class="mb-6" variant="outlined">
      <v-card-text>
        <v-row align="center">
          <!-- Recherche -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              placeholder="Rechercher des ressources..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>

          <!-- Filtres -->
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="selectedCategory"
              :items="categories"
              placeholder="Toutes les catégories"
              prepend-inner-icon="mdi-tag"
              variant="outlined"
              density="compact"
              clearable
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
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="selectedStatus"
              :items="[
                { value: 'ALL', title: 'Tous les statuts' },
                { value: 'PUBLISHED', title: 'Publiées' },
                { value: 'DRAFT', title: 'Brouillons' },
                { value: 'PENDING', title: 'En attente' }
              ]"
              item-value="value"
              item-title="title"
              prepend-inner-icon="mdi-filter"
              variant="outlined"
              density="compact"
            />
          </v-col>

          <!-- Actions -->
          <v-col cols="12" md="2">
            <div class="d-flex gap-2">
              <v-btn-toggle v-model="viewMode" mandatory density="compact">
                <v-btn value="grid" icon="mdi-view-grid" />
                <v-btn value="list" icon="mdi-view-list" />
              </v-btn-toggle>
              
              <v-btn
                variant="outlined"
                density="compact"
                @click="clearFilters"
              >
                Effacer
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Chargement -->
    <v-row v-if="isLoading" justify="center">
      <v-col cols="auto">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>
    </v-row>

    <!-- Affichage des ressources -->
    <div v-else-if="filteredResources.length > 0">
      <!-- Vue grille -->
      <v-row v-if="viewMode === 'grid'">
        <v-col
          v-for="resource in filteredResources"
          :key="resource.uuid"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="resource-card"
            height="100%"
            elevation="2"
            @click="showResource(resource)"
          >
            <!-- En-tête de carte -->
            <v-card-item>
              <div class="d-flex align-center justify-space-between">
                <v-icon
                  :color="getResourceColor(resource.category)"
                  size="large"
                >
                  {{ getResourceIcon(resource.category) }}
                </v-icon>
                
                <v-chip
                  :color="getStatusColor(resource.status)"
                  size="small"
                  variant="flat"
                >
                  {{ getStatusText(resource.status) }}
                </v-chip>
              </div>
            </v-card-item>

            <!-- Contenu -->
            <v-card-text>
              <h3 class="text-h6 font-weight-medium mb-2">
                {{ resource.title }}
              </h3>
              
              <div class="mb-3">
                <v-chip
                  :color="getResourceColor(resource.category)"
                  size="small"
                  variant="tonal"
                  class="mr-2 mb-1"
                >
                  {{ getCategoryDisplayName(resource.category) }}
                </v-chip>
              </div>

              <div class="text-caption text-medium-emphasis">
                Créé le {{ formatDate(resource.createdAt) }}
              </div>
              
              <div v-if="resource.validatedAndPublishedAt" class="text-caption text-success">
                Publié le {{ formatDate(resource.validatedAndPublishedAt) }}
              </div>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions>
              <v-btn
                variant="text"
                color="primary"
                @click.stop="showResource(resource)"
              >
                <v-icon class="mr-1">mdi-eye</v-icon>
                Voir
              </v-btn>
              
              <v-btn
                variant="text"
                color="secondary"
                @click.stop="downloadResource(resource)"
              >
                <v-icon class="mr-1">mdi-download</v-icon>
                Télécharger
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Vue liste -->
      <v-card v-else variant="outlined">
        <v-list>
          <v-list-item
            v-for="(resource, index) in filteredResources"
            :key="resource.uuid"
            @click="showResource(resource)"
            class="resource-list-item"
          >
            <template #prepend>
              <v-icon
                :color="getResourceColor(resource.category)"
                class="mr-4"
              >
                {{ getResourceIcon(resource.category) }}
              </v-icon>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ resource.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="d-flex align-center gap-4 mt-1">
              <span>{{ getCategoryDisplayName(resource.category) }}</span>
              <span>{{ formatDate(resource.createdAt) }}</span>
            </v-list-item-subtitle>

            <template #append>
              <div class="d-flex align-center gap-2">
                <v-chip
                  :color="getStatusColor(resource.status)"
                  size="small"
                  variant="flat"
                >
                  {{ getStatusText(resource.status) }}
                </v-chip>
                
                <v-btn
                  variant="text"
                  color="primary"
                  density="compact"
                  @click.stop="downloadResource(resource)"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </div>
            </template>

            <v-divider v-if="index < filteredResources.length - 1" />
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <!-- Aucune ressource trouvée -->
    <v-card v-else class="pa-8 text-center" variant="outlined">
      <v-icon size="64" color="grey" class="mb-4">mdi-folder-open</v-icon>
      <h3 class="text-h6 mb-2">Aucune ressource trouvée</h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ searchQuery || selectedCategory 
           ? 'Essayez de modifier vos critères de recherche.' 
           : 'Il n\'y a pas encore de ressources.' }}
      </p>
      
      <div class="d-flex justify-center gap-3">
        <v-btn
          v-if="searchQuery || selectedCategory"
          variant="outlined"
          @click="clearFilters"
        >
          Effacer les filtres
        </v-btn>
        
        <v-btn
          color="primary"
          @click="router.push('/resources/create')"
        >
          Créer la première ressource
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
.resource-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.resource-card:hover {
  transform: translateY(-2px);
}

.resource-list-item {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.resource-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}
</style>
