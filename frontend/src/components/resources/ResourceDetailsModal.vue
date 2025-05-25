<template>
  <v-dialog v-model="isOpen" max-width="900" scrollable>
    <v-card v-if="resource" class="social-card">
      <!-- En-tête style réseau social -->
      <v-card-title class="social-header pa-4">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-avatar 
              :color="getResourceColor(resource.category)" 
              class="mr-3"
              size="40"
            >
              <v-icon :color="'white'">
                {{ getResourceIcon(resource.category) }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-h6">{{ resource.title }}</div>
              <div class="text-caption text-medium-emphasis">
                Par {{ resource.authorUuid }} • {{ formatDate(resource.createdAt) }}
              </div>
            </div>
          </div>
          <v-chip :color="getStatusColor(resource.status)" variant="flat" size="small">
            {{ getStatusText(resource.status) }}
          </v-chip>
        </div>
      </v-card-title>

      <v-divider />

      <!-- Contenu principal -->
      <v-card-text class="social-content pa-4">
        <!-- Métadonnées de la ressource -->
        <div class="mb-4">
          <v-chip 
            size="small" 
            variant="tonal" 
            :color="getResourceColor(resource.category)"
            class="mr-2"
          >
            <v-icon start size="16">{{ getResourceIcon(resource.category) }}</v-icon>
            {{ getCategoryDisplayName(resource.category) }}
          </v-chip>
        </div>

        <!-- Aperçu du contenu -->
        <div class="content-section mb-4">
          <!-- Chargement du contenu -->
          <div v-if="isLoadingContent" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64" />
            <div class="mt-3 text-body-1">Chargement du contenu...</div>
          </div>

          <!-- Contenu chargé -->
          <div v-else>
            <!-- Contenu texte -->
            <div v-if="resourceContentType?.startsWith('text/') && resourceContent" class="mb-4">
              <div class="text-caption text-medium-emphasis mb-3">
                📄 {{ resourceContentType }}
              </div>
              
              <!-- Contenu HTML -->
              <div v-if="resourceContentType === 'text/html'" class="content-display">
                <v-card variant="outlined" class="pa-4">
                  <div v-html="resourceContent" class="rendered-content"></div>
                </v-card>
              </div>
              
              <!-- Contenu texte brut -->
              <div v-else class="content-display">
                <v-card variant="outlined" class="pa-4">
                  <div class="text-body-1" style="white-space: pre-wrap; line-height: 1.6;">
                    {{ resourceContent }}
                  </div>
                </v-card>
              </div>
            </div>

            <!-- Message d'erreur ou d'information -->
            <div v-else-if="resourceContent" class="mb-4">
              <v-alert 
                :type="resourceContent.includes('🔒') ? 'warning' : 'info'" 
                variant="tonal"
              >
                {{ resourceContent }}
              </v-alert>
            </div>

            <!-- Contenu image -->
            <div v-else-if="resourceContentType?.startsWith('image/')" class="mb-4">
              <div class="text-caption text-medium-emphasis mb-3">
                🖼️ {{ resourceContentType }}
              </div>
              <v-card variant="outlined" class="pa-4 text-center">
                <img 
                  :src="`${apiBaseUrl}/resource/image/${resource.contentGridfsUuid}`"
                  style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
              </v-card>
            </div>

            <!-- Autres types de fichiers -->
            <div v-else class="mb-4">
              <div class="text-caption text-medium-emphasis mb-3">
                📁 {{ resourceContentType || 'Type non défini' }}
              </div>
              <v-alert type="info" variant="tonal">
                <v-icon class="mr-2">mdi-information</v-icon>
                Ce type de fichier ne peut pas être prévisualisé directement.
                <br><strong>ID GridFS :</strong> <code>{{ resource.contentGridfsUuid }}</code>
              </v-alert>
            </div>
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Actions de modération -->
        <div class="moderation-actions mb-4">
          <div class="text-subtitle-2 mb-3 d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-shield-check</v-icon>
            Actions de modération
          </div>
          
          <div class="d-flex gap-2 flex-wrap">
            <v-btn
              v-if="resource.status !== 'PUBLISHED'"
              color="success"
              variant="flat"
              size="small"
              @click="$emit('updateStatus', resource, 'PUBLISHED')"
            >
              <v-icon start>mdi-check-circle</v-icon>
              Publier
            </v-btn>
            <v-btn
              v-if="resource.status !== 'PENDING'"
              color="warning"
              variant="flat"
              size="small"
              @click="$emit('updateStatus', resource, 'PENDING')"
            >
              <v-icon start>mdi-clock</v-icon>
              En attente
            </v-btn>
            <v-btn
              v-if="resource.status !== 'DRAFT'"
              color="info"
              variant="flat"
              size="small"
              @click="$emit('updateStatus', resource, 'DRAFT')"
            >
              <v-icon start>mdi-file-edit</v-icon>
              Brouillon
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <!-- Actions du dialog -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="outlined" @click="closeModal">
          <v-icon start>mdi-close</v-icon>
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useResourceHelpers, type Resource } from '@/composables/useResourceHelpers'
import { Api } from '@/api/api'

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

// Props & Emits
const props = defineProps<{
  modelValue: boolean
  resource: Resource | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'updateStatus': [resource: Resource, status: string]
}>()

// API
const api = new Api()
const apiBaseUrl = api.baseUrl

// State
const isLoadingContent = ref(false)
const resourceContent = ref<string | null>(null)
const resourceContentType = ref<string | null>(null)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Methods
const loadResourceContent = async (resource: Resource) => {
  console.log('🔍 DEBUG - Starting loadResourceContent with resource:', resource)
  console.log('🔍 DEBUG - Resource UUID:', resource.uuid)
  console.log('🔍 DEBUG - Resource contentGridfsUuid from frontend:', resource.contentGridfsUuid)
  
  isLoadingContent.value = true
  resourceContent.value = null
  resourceContentType.value = null
  
  try {
    console.log('🔍 DEBUG - Making API call to resource/' + resource.uuid)
    // Récupérer les métadonnées de la ressource pour avoir le type MIME
    const resourceResponse = await api.get(`resource/${resource.uuid}`)
    const resourceData = resourceResponse.data as any
    
    console.log('🔍 DEBUG - Resource data from backend:', resourceData)
    console.log('🔍 DEBUG - Resource contentGridfsId:', resourceData?.contentGridfsId)
    console.log('🔍 DEBUG - Resource contentGridfsUuid:', resourceData?.contentGridfsUuid)
    console.log('🔍 DEBUG - Resource resourceMIMEType:', resourceData?.resourceMIMEType)
    
    if (resourceData && resourceData.resourceMIMEType) {
      resourceContentType.value = resourceData.resourceMIMEType
      console.log('🔍 DEBUG - Set resourceContentType to:', resourceContentType.value)
      
      // Si c'est du texte, récupérer le contenu
      if (resourceData.resourceMIMEType.startsWith('text/')) {
        console.log('🔍 DEBUG - Resource is text type, fetching content...')
        try {
          console.log('🔍 DEBUG - About to fetch content with ID:', resourceData.contentGridfsId)
          console.log('🔍 DEBUG - Making API call to resource/content/' + resourceData.contentGridfsId)
          // Utiliser l'API axios pour récupérer le contenu  
          const contentResponse = await api.get(`resource/content/${resourceData.contentGridfsId}`, {
            responseType: 'text'
          })
          console.log('🔍 DEBUG - Content response:', contentResponse)
          console.log('🔍 DEBUG - Content data:', contentResponse.data)
          console.log('🔍 DEBUG - Content response type:', typeof contentResponse)
          console.log('🔍 DEBUG - Content response keys:', Object.keys(contentResponse))
          
          // La réponse semble être directement le contenu, pas dans .data
          const content = contentResponse.data || contentResponse
          console.log('🔍 DEBUG - Final content to use:', content)
          
          resourceContent.value = content as string || 'Contenu non disponible'
          console.log('🔍 DEBUG - Set resourceContent to:', resourceContent.value)
        } catch (error: any) {
          console.error('❌ DEBUG - Erreur chargement contenu:', error)
          console.error('❌ DEBUG - Error response:', error.response)
          console.error('❌ DEBUG - Error status:', error.response?.status)
          console.error('❌ DEBUG - Error data:', error.response?.data)
          
          // Gérer spécifiquement les erreurs d'autorisation
          if (error.response?.status === 401 || error.response?.status === 403) {
            resourceContent.value = '🔒 Accès au contenu restreint - Droits de modération requis'
          } else if (error.code === 'ERR_NETWORK') {
            resourceContent.value = '🌐 Erreur de connexion au serveur - Vérifiez que le backend est démarré'
          } else {
            resourceContent.value = 'Erreur lors du chargement du contenu'
          }
        }
      } else {
        // Pour les autres types de fichiers, afficher les informations disponibles
        resourceContent.value = `Fichier ${resourceData.resourceMIMEType} disponible (ID: ${resourceData.contentGridfsId})`
      }
    } else {
      console.error('❌ DEBUG - No resourceData or resourceMIMEType found')
      resourceContent.value = 'Aucune donnée de ressource trouvée'
    }
  } catch (error: any) {
    console.error('❌ DEBUG - Erreur lors du chargement du contenu:', error)
    console.error('❌ DEBUG - Error response:', error.response)
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      resourceContent.value = '🔒 Accès refusé - Connectez-vous en tant que modérateur'
    } else if (error.code === 'ERR_NETWORK') {
      resourceContent.value = '🌐 Erreur de connexion - Le backend n\'est pas démarré'
    } else {
      resourceContent.value = 'Erreur lors du chargement des métadonnées'
    }
  } finally {
    console.log('🔍 DEBUG - loadResourceContent finished. Final resourceContent:', resourceContent.value)
    isLoadingContent.value = false
  }
}

const closeModal = () => {
  isOpen.value = false
}

// Watchers
watch(() => props.resource, (newResource) => {
  if (newResource && props.modelValue) {
    loadResourceContent(newResource)
  }
}, { immediate: true })

watch(() => props.modelValue, (newValue) => {
  if (newValue && props.resource) {
    loadResourceContent(props.resource)
  } else if (!newValue) {
    // Reset content when modal closes
    resourceContent.value = null
    resourceContentType.value = null
  }
})
</script>

<style scoped>
.social-card {
  border-radius: 8px;
  overflow: hidden;
}

.content-display {
  max-height: 400px;
  overflow-y: auto;
}

.rendered-content {
  line-height: 1.6;
}

.rendered-content h1, .rendered-content h2, .rendered-content h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.rendered-content p {
  margin-bottom: 0.5rem;
}

.rendered-content ul, .rendered-content ol {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.rendered-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.gap-2 {
  gap: 8px;
}
</style> 