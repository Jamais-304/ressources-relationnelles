<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WysiwygEditor from './WysiwygEditor.vue'
import { getPublicCategories, getActiveRelationTypes, type Category, type RelationType } from '@/api/services'
import { getToken } from '@/utils/cookies'

interface Props {
  initialData?: {
    title?: string
    category?: string
    relationType?: string
    content?: string
  }
}

const props = defineProps<Props>()
const router = useRouter()

// State
const isLoading = ref(false)
const notification = ref({ show: false, message: '', type: 'success' })
const formData = ref({
  title: props.initialData?.title || '',
  category: props.initialData?.category || '',
  relationType: props.initialData?.relationType || '',
  contentType: 'rich-text' as 'rich-text' | 'file',
  content: props.initialData?.content || '',
  file: null as File | null
})

// API Data
const categories = ref<Category[]>([])
const relationTypes = ref<RelationType[]>([])

// Computed
const isFormValid = computed(() => {
  return formData.value.title.trim() &&
         formData.value.category &&
         formData.value.relationType &&
         (formData.value.contentType === 'rich-text' ?
          formData.value.content.trim() :
          formData.value.file)
})

const selectedFile = ref<File | null>(null)

// Methods
const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Watchers
watch(() => formData.value.contentType, (newType) => {
  if (newType === 'rich-text') {
    selectedFile.value = null
  } else {
    formData.value.content = ''
  }
})

// Watcher pour synchroniser selectedFile avec formData.file
watch(selectedFile, (newFile) => {
  if (newFile) {
    // v-file-input peut retourner un tableau ou un seul fichier
    const file = Array.isArray(newFile) ? newFile[0] : newFile
    formData.value.file = file

    // Validation simple
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      showNotification('Le fichier est trop volumineux (max 10MB)', 'error')
      selectedFile.value = null
      formData.value.file = null
    }
  } else {
    formData.value.file = null
  }
})

// Methods
const submitForm = async () => {
  if (!isFormValid.value) {
    showNotification('Veuillez remplir tous les champs requis', 'error')
    return
  }

  isLoading.value = true

  try {
    const accessToken = getToken('accessToken')

    if (!accessToken) {
      showNotification('Vous devez être connecté pour créer une ressource', 'error')
      return
    }

    if (formData.value.contentType === 'rich-text') {
      // Création d'une ressource texte avec la nouvelle API
      const response = await fetch('http://localhost:3000/api/v1/resource/create-text', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.value.title,
          content: formData.value.content,
          category: formData.value.category,
          relationType: formData.value.relationType
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Ressource texte créée:', responseData)
    } else {
      // Upload d'un fichier
      if (!formData.value.file) {
        showNotification('Veuillez sélectionner un fichier', 'error')
        return
      }

      console.log('🔍 DEBUG Frontend - About to send file:', {
        file: formData.value.file,
        fileName: formData.value.file.name,
        fileSize: formData.value.file.size,
        fileType: formData.value.file.type
      })

      const formDataToSend = new FormData()
      formDataToSend.append('file', formData.value.file)
      formDataToSend.append('title', formData.value.title)
      formDataToSend.append('category', formData.value.category)
      formDataToSend.append('relationType', formData.value.relationType)

      console.log('🔍 DEBUG Frontend - FormData contents:')
      for (const [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value)
      }

      // Utiliser fetch au lieu d'axios pour éviter les problèmes de Content-Type
      const response = await fetch('http://localhost:3000/api/v1/resource/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
          // Pas de Content-Type, le navigateur l'ajoute automatiquement avec la boundary
        },
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      console.log('Ressource fichier créée:', responseData)
    }

    showNotification('Ressource créée avec succès!')
    // router.push('/resources')
  } catch (error: any) {
    console.error('Erreur lors de la création:', error)
    const errorMessage = error.response?.data?.message || 'Erreur lors de la création de la ressource'
    showNotification(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Charger les catégories et types de relations depuis l'API
    const [categoriesData, relationTypesData] = await Promise.all([
      getPublicCategories(),
      getActiveRelationTypes()
    ])

    categories.value = categoriesData
    relationTypes.value = relationTypesData

    console.log('Catégories chargées:', categoriesData)
    console.log('Types de relations chargés:', relationTypesData)

    // Si pas de données, utiliser les valeurs par défaut comme fallback
    if (categories.value.length === 0) {
      categories.value = [
        { _id: '1', name: 'sante_mentale', description: 'Santé mentale', createdAt: '', updatedAt: '' },
        { _id: '2', name: 'sorties', description: 'Sorties', createdAt: '', updatedAt: '' },
        { _id: '3', name: 'bien_etre', description: 'Bien-être', createdAt: '', updatedAt: '' },
        { _id: '4', name: 'support_communautaire', description: 'Support communautaire', createdAt: '', updatedAt: '' },
        { _id: '5', name: 'ressources_professionnelles', description: 'Ressources professionnelles', createdAt: '', updatedAt: '' },
        { _id: '6', name: 'formation', description: 'Formation', createdAt: '', updatedAt: '' }
      ]
    }

    if (relationTypes.value.length === 0) {
      relationTypes.value = [
        { _id: '1', name: 'family', displayName: 'Famille', isActive: true, createdAt: '', updatedAt: '' },
        { _id: '2', name: 'friends', displayName: 'Amis', isActive: true, createdAt: '', updatedAt: '' },
        { _id: '3', name: 'colleagues', displayName: 'Collègues', isActive: true, createdAt: '', updatedAt: '' },
        { _id: '4', name: 'romantic', displayName: 'Relation amoureuse', isActive: true, createdAt: '', updatedAt: '' },
        { _id: '5', name: 'general', displayName: 'Relations en général', isActive: true, createdAt: '', updatedAt: '' }
      ]
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    showNotification('Erreur lors du chargement des options', 'error')
  }
})
</script>

<template>
  <div>
    <!-- Notification -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.type === 'error' ? 'error' : 'success'"
      :timeout="3000"
      top
    >
      {{ notification.message }}
      <template #actions>
        <v-btn
          variant="text"
          @click="notification.show = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>

    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-plus-circle</v-icon>
        Créer une nouvelle ressource
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <!-- Titre -->
          <v-text-field
            v-model="formData.title"
            label="Titre de la ressource *"
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            placeholder="Donnez un titre descriptif à votre ressource"
            :rules="[v => !!v || 'Le titre est requis']"
            class="mb-4"
          />

          <!-- Catégorie -->
          <v-select
            v-model="formData.category"
            :items="categories"
            item-title="name"
            item-value="name"
            label="Catégorie *"
            variant="outlined"
            prepend-inner-icon="mdi-tag"
            placeholder="Sélectionnez une catégorie"
            :rules="[v => !!v || 'La catégorie est requise']"
            class="mb-4"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="item.raw.description">
                  {{ item.raw.description }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>

          <!-- Type de relation -->
          <v-select
            v-model="formData.relationType"
            :items="relationTypes"
            item-title="displayName"
            item-value="name"
            label="Type de relation *"
            variant="outlined"
            prepend-inner-icon="mdi-account-group"
            placeholder="Sélectionnez le type de relation concerné"
            :rules="[v => !!v || 'Le type de relation est requis']"
            class="mb-4"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.displayName }}</v-list-item-title>
                <v-list-item-subtitle v-if="item.raw.description">
                  {{ item.raw.description }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>

          <!-- Type de contenu -->
          <v-card variant="outlined" class="mb-4">
            <v-card-subtitle class="text-subtitle-2 font-weight-medium">
              <v-icon class="mr-1">mdi-file-document</v-icon>
              Type de contenu *
            </v-card-subtitle>
            <v-card-text>
              <v-radio-group v-model="formData.contentType" inline>
                <v-radio
                  label="Texte enrichi"
                  value="rich-text"
                  color="primary"
                >
                  <template #label>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-format-text</v-icon>
                      <span>Texte enrichi</span>
                    </div>
                  </template>
                </v-radio>
                <v-radio
                  label="Fichier (PDF, image, vidéo...)"
                  value="file"
                  color="primary"
                >
                  <template #label>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-file-upload</v-icon>
                      <span>Fichier</span>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>

          <!-- Contenu conditionnel -->
          <div v-if="formData.contentType === 'rich-text'">
            <div class="text-subtitle-2 font-weight-medium mb-2">
              <v-icon class="mr-1">mdi-format-text</v-icon>
              Contenu de la ressource *
            </div>
            <WysiwygEditor
              v-model="formData.content"
              placeholder="Rédigez votre ressource ici..."
              class="mb-4"
            />
          </div>

          <div v-else>
            <v-file-input
              v-model="selectedFile"
              label="Fichier *"
              variant="outlined"
              prepend-inner-icon="mdi-paperclip"
              accept="*/*"
              placeholder="Sélectionnez un fichier"
              show-size
              :rules="[v => !!v || 'Un fichier est requis']"
              class="mb-4"
            />
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
            >
              <div class="text-body-2">
                <strong>Formats acceptés :</strong> PDF, images (JPG, PNG, GIF), vidéos (MP4, WebM), audio (MP3, WAV)
                <br>
                <strong>Taille maximale :</strong> 10 MB
              </div>
            </v-alert>
          </div>

          <!-- Actions -->
          <v-row class="mt-6">
            <v-col cols="12" class="d-flex justify-end gap-3">
              <v-btn
                variant="outlined"
                @click="router.back()"
                :disabled="isLoading"
              >
                <v-icon class="mr-2">mdi-arrow-left</v-icon>
                Annuler
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                :loading="isLoading"
                :disabled="!isFormValid"
              >
                <v-icon class="mr-2">mdi-check</v-icon>
                Créer la ressource
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.gap-3 {
  gap: 12px;
}
</style>
