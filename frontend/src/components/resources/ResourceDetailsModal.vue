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
        <div v-if="isAdmin" class="d-flex gap-2 flex-wrap">
          <v-btn
            color="success"
            variant="flat"
            @click="$emit('updateStatus', resource, 'PUBLISHED')"
            :disabled="resource.status === 'PUBLISHED'"
          >
            <v-icon start>mdi-check</v-icon>
            Publier
          </v-btn>
          
          <v-btn
            color="warning"
            variant="flat"
            @click="$emit('updateStatus', resource, 'PENDING')"
            :disabled="resource.status === 'PENDING'"
          >
            <v-icon start>mdi-clock</v-icon>
            En attente
          </v-btn>
          
          <v-btn
            color="info"
            variant="flat"
            @click="$emit('updateStatus', resource, 'DRAFT')"
            :disabled="resource.status === 'DRAFT'"
          >
            <v-icon start>mdi-file-document-edit</v-icon>
            Brouillon
          </v-btn>
        </div>

        <v-divider class="my-6" />

        <!-- Section des commentaires -->
        <CommentSection 
          v-if="resource"
          :resource-id="resource.uuid"
        />
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
import { useAuthUserStore } from '@/stores/authUserStore'
import { Api } from '@/api/api'
import CommentSection from './CommentSection.vue'

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

// Store
const { isAdmin } = useAuthUserStore()

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
  console.log('🔍 DEBUG - User isAdmin:', isAdmin)
  
  isLoadingContent.value = true
  resourceContent.value = null
  resourceContentType.value = null
  
  try {
    let resourceResponse
    
    // Si l'utilisateur est admin, utiliser l'endpoint avec authentification
    // Sinon, utiliser l'endpoint public (seulement pour les ressources publiées)
    if (isAdmin) {
      console.log('🔍 DEBUG - Admin user, using authenticated endpoint')
      resourceResponse = await api.get(`resource/${resource.uuid}`)
    } else {
      console.log('🔍 DEBUG - Regular user, using public endpoint')
      resourceResponse = await api.get(`resource/published/${resource.uuid}`)
    }
    
    const resourceData = resourceResponse.data as any
    
    console.log('🔍 DEBUG - Resource data from backend:', resourceData)
    console.log('🔍 DEBUG - Resource contentGridfsId:', resourceData?.contentGridfsId)
    console.log('🔍 DEBUG - Resource resourceMIMEType:', resourceData?.resourceMIMEType)
    
    if (resourceData && resourceData.resourceMIMEType) {
      resourceContentType.value = resourceData.resourceMIMEType
      console.log('🔍 DEBUG - Set resourceContentType to:', resourceContentType.value)
      
      // Si c'est du texte, récupérer le contenu
      if (resourceData.resourceMIMEType.startsWith('text/')) {
        console.log('🔍 DEBUG - Resource is text type, fetching content...')
        try {
          let contentResponse
          
          // Si l'utilisateur est admin, utiliser l'endpoint avec authentification
          if (isAdmin) {
            console.log('🔍 DEBUG - Admin user, fetching content with auth')
            contentResponse = await api.get(`resource/content/${resourceData.contentGridfsId}`, {
              responseType: 'text'
            })
          } else {
            console.log('🔍 DEBUG - Regular user, fetching public content')
            contentResponse = await api.get(`resource/published/${resource.uuid}/content`, {
              responseType: 'text'
            })
          }
          
          const content = contentResponse.data || contentResponse
          resourceContent.value = content as string || 'Contenu non disponible'
          console.log('🔍 DEBUG - Set resourceContent:', resourceContent.value)
        } catch (error: any) {
          console.error('❌ DEBUG - Erreur chargement contenu:', error)
          resourceContent.value = 'Contenu non disponible'
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
    
    resourceContent.value = 'Informations non disponibles'
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