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

// Lifecycle
onMounted(() => {
  loadResources()
})
</script>

<template>
  <v-container fluid class="pa-6">
    <!-- En-tête -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold text-primary mb-2">
        <v-icon class="mr-3" size="large">mdi-shield-check</v-icon>
        Modération des Ressources
      </h1>
      <p class="text-subtitle-1 text-medium-emphasis">
        Gérez et validez les ressources en attente de publication
      </p>
    </div>

    <!-- Statistiques -->
    <ResourceStatisticsCards :resources="resources" />

    <!-- Filtres -->
    <ResourceFilters
      v-model:search-query="searchQuery"
      v-model:selected-status="selectedStatus"
    />

    <!-- Liste des ressources -->
    <v-card variant="outlined">
      <v-card-title>
        <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
        Ressources ({{ filteredResources.length }})
      </v-card-title>

      <v-progress-linear v-if="isLoading" indeterminate color="primary" />

      <v-data-table
        v-else
        :items="filteredResources"
        :headers="[
          { title: 'Titre', value: 'title', sortable: true },
          { title: 'Catégorie', value: 'category', sortable: true },
          { title: 'Statut', value: 'status', sortable: true },
          { title: 'Créé le', value: 'createdAt', sortable: true },
          { title: 'Actions', value: 'actions', sortable: false }
        ]"
        items-per-page="10"
        class="elevation-0"
      >
        <template #item.title="{ item }">
          <div class="font-weight-medium">{{ item.title }}</div>
        </template>

        <template #item.category="{ item }">
          <v-chip size="small" variant="tonal">
            {{ getCategoryDisplayName(item.category) }}
          </v-chip>
        </template>

        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            :prepend-icon="getStatusIcon(item.status)"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #item.createdAt="{ item }">
          <span class="text-body-2">{{ formatDate(item.createdAt) }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <v-btn
              density="compact"
              variant="text"
              color="primary"
              @click="openResourceDetails(item)"
            >
              <v-icon>mdi-eye</v-icon>
              <v-tooltip activator="parent">Voir détails</v-tooltip>
            </v-btn>

            <v-btn
              v-if="item.status !== 'PUBLISHED'"
              density="compact"
              variant="text"
              color="success"
              @click="openStatusDialog(item, 'PUBLISHED')"
            >
              <v-icon>mdi-check</v-icon>
              <v-tooltip activator="parent">Publier</v-tooltip>
            </v-btn>

            <v-btn
              v-if="item.status === 'DRAFT'"
              density="compact"
              variant="text"
              color="warning"
              @click="openStatusDialog(item, 'PENDING')"
            >
              <v-icon>mdi-clock</v-icon>
              <v-tooltip activator="parent">Mettre en attente</v-tooltip>
            </v-btn>

            <v-btn
              v-if="item.status !== 'DRAFT'"
              density="compact"
              variant="text"
              color="info"
              @click="openStatusDialog(item, 'DRAFT')"
            >
              <v-icon>mdi-file-edit</v-icon>
              <v-tooltip activator="parent">Remettre en brouillon</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de confirmation -->
    <v-dialog v-model="confirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          Confirmation de changement de statut
        </v-card-title>
        
        <v-card-text>
          <p>Êtes-vous sûr de vouloir changer le statut de cette ressource ?</p>
          
          <div v-if="selectedResource" class="mt-4">
            <v-alert type="info" variant="tonal">
              <strong>Ressource :</strong> {{ selectedResource.title }}<br>
              <strong>Nouveau statut :</strong> {{ getStatusText(newStatus) }}
            </v-alert>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="confirmDialog = false"
          >
            Annuler
          </v-btn>
          <v-btn
            :color="getStatusColor(newStatus)"
            @click="updateResourceStatus"
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
  </v-container>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style> 