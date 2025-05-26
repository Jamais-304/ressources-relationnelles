<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Api, Role } from '@/api/api'
import { useAuthUserStore } from '@/stores/authUserStore'
import { toast } from 'vue3-toastify'

// Types
interface Comment {
  _id: string
  content: string
  authorId: string
  authorPseudo: string
  resourceId: string
  createdAt: string
  updatedAt: string
}

// Props
const props = defineProps<{
  resourceId: string
}>()

// Composables
const router = useRouter()
const api = new Api()
const { authUser, isAuthenticated } = useAuthUserStore()

// State
const comments = ref<Comment[]>([])
const newComment = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const showComments = ref(true)

// Edit state
const editingComment = ref<Comment | null>(null)
const editContent = ref('')

// Delete state
const deleteDialog = ref(false)
const commentToDelete = ref<Comment | null>(null)

// Computed
const currentUser = computed(() => authUser)

// Validation rules
const rules = {
  required: (value: string) => !!value.trim() || 'Le commentaire ne peut pas être vide',
  minLength: (value: string) => value.length >= 3 || 'Le commentaire doit contenir au moins 3 caractères'
}

// Methods
const fetchComments = async () => {
  console.log('🔍 DEBUG - fetchComments called')
  console.log('🔍 DEBUG - props.resourceId:', props.resourceId)
  
  if (!props.resourceId) {
    console.log('❌ DEBUG - No resourceId provided')
    return
  }
  
  isLoading.value = true
  console.log('🔍 DEBUG - Starting fetchComments API call...')
  
  try {
    const url = `resource/published/${props.resourceId}/comments`
    console.log('🔍 DEBUG - Fetch URL:', url)
    
    const response = await api.get(url) as any
    console.log('✅ DEBUG - Fetch response:', response)
    
    if (response?.data?.comments) {
      console.log('✅ DEBUG - Comments found:', response.data.comments)
      comments.value = response.data.comments
    } else {
      console.log('⚠️ DEBUG - No comments in response')
    }
  } catch (error: any) {
    console.error('❌ DEBUG - Fetch error details:', error)
    console.error('❌ DEBUG - Fetch error response:', error.response)
    toast.error('Erreur lors du chargement des commentaires')
  } finally {
    console.log('🔍 DEBUG - Setting isLoading to false')
    isLoading.value = false
  }
}

const handleSubmitComment = async () => {
  console.log('🔍 DEBUG - handleSubmitComment called')
  console.log('🔍 DEBUG - newComment.value:', newComment.value)
  console.log('🔍 DEBUG - currentUser.value:', currentUser.value)
  console.log('🔍 DEBUG - props.resourceId:', props.resourceId)
  
  if (!newComment.value.trim() || !currentUser.value) {
    console.log('❌ DEBUG - Validation failed')
    return
  }

  isSubmitting.value = true
  console.log('🔍 DEBUG - Starting API call...')
  
  try {
    const payload = {
      content: newComment.value.trim(),
      authorId: currentUser.value.uuid,
      resourceId: props.resourceId
    }
    console.log('🔍 DEBUG - Payload:', payload)
    console.log('🔍 DEBUG - URL:', `comments/${currentUser.value.uuid}`)
    
    const response = await api.post(`comments/${currentUser.value.uuid}`, payload)
    console.log('✅ DEBUG - API response:', response)

    newComment.value = ''
    toast.success('Commentaire publié avec succès')
    console.log('🔍 DEBUG - About to fetch comments...')
    await fetchComments()
    console.log('🔍 DEBUG - Fetch comments completed')
  } catch (error: any) {
    console.error('❌ DEBUG - Error details:', error)
    console.error('❌ DEBUG - Error response:', error.response)
    console.error('❌ DEBUG - Error message:', error.message)
    toast.error('Erreur lors de la publication du commentaire')
  } finally {
    console.log('🔍 DEBUG - Setting isSubmitting to false')
    isSubmitting.value = false
  }
}

const canManageComment = (comment: Comment) => {
  if (!currentUser.value) return false
  return isCommentAuthor(comment) || isAdmin()
}

const isCommentAuthor = (comment: Comment) => {
  return currentUser.value?.uuid === comment.authorId
}

const isAdmin = () => {
  return currentUser.value?.role === Role.Admin || currentUser.value?.role === Role.SuperAdmin
}

const startEditComment = (comment: Comment) => {
  editingComment.value = comment
  editContent.value = comment.content
}

const cancelEdit = () => {
  editingComment.value = null
  editContent.value = ''
}

const saveEditComment = async () => {
  if (!editingComment.value || !editContent.value.trim()) return

  isSubmitting.value = true
  try {
    await api.put(`comments/${editingComment.value._id}`, {
      content: editContent.value.trim()
    })

    toast.success('Commentaire modifié avec succès')
    cancelEdit()
    await fetchComments()
  } catch (error) {
    console.error('Erreur lors de la modification du commentaire:', error)
    toast.error('Erreur lors de la modification du commentaire')
  } finally {
    isSubmitting.value = false
  }
}

const confirmDeleteComment = (comment: Comment) => {
  commentToDelete.value = comment
  deleteDialog.value = true
}

const deleteComment = async () => {
  if (!commentToDelete.value) return

  isSubmitting.value = true
  try {
    await api.delete(`comments/${commentToDelete.value._id}`)
    
    toast.success('Commentaire supprimé avec succès')
    deleteDialog.value = false
    commentToDelete.value = null
    await fetchComments()
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error)
    toast.error('Erreur lors de la suppression du commentaire')
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60)
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Watchers
watch(() => props.resourceId, (newResourceId) => {
  if (newResourceId) {
    fetchComments()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  console.log('🔍 DEBUG - CommentSection mounted')
  console.log('🔍 DEBUG - isAuthenticated:', isAuthenticated)
  console.log('🔍 DEBUG - currentUser:', currentUser.value)
  console.log('🔍 DEBUG - props.resourceId:', props.resourceId)
  
  if (props.resourceId) {
    fetchComments()
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <!-- En-tête de la section commentaires -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-100 rounded-lg">
          <v-icon size="20" color="blue">mdi-comment-multiple</v-icon>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Commentaires</h3>
          <p class="text-sm text-gray-500">{{ comments.length }} commentaire{{ comments.length > 1 ? 's' : '' }}</p>
        </div>
      </div>
    </div>

    <!-- Formulaire pour ajouter un commentaire -->
    <div v-if="isAuthenticated" class="p-6 border-b border-gray-200">
      <div class="flex gap-4">
        <v-avatar size="40" color="blue-500" class="flex-shrink-0">
          <v-icon color="white" size="20">mdi-account</v-icon>
        </v-avatar>
        
        <div class="flex-1">
          <v-form @submit.prevent="handleSubmitComment">
            <v-textarea
              v-model="newComment"
              placeholder="Partagez votre avis sur cette ressource..."
              variant="outlined"
              rows="3"
              auto-grow
              :disabled="isSubmitting"
              :rules="[rules.required, rules.minLength]"
              counter="500"
              maxlength="500"
              hide-details="auto"
              class="mb-3"
            />
            
            <div class="flex justify-end">
              <v-btn
                type="submit"
                color="blue"
                :loading="isSubmitting"
                :disabled="!newComment.trim() || newComment.length < 3"
                variant="flat"
                class="px-6"
              >
                <v-icon start size="18">mdi-send</v-icon>
                Publier
              </v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </div>

    <!-- Message pour les utilisateurs non connectés -->
    <div v-else class="p-6 border-b border-gray-200">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <v-icon color="blue" size="20">mdi-account-plus</v-icon>
          <div class="flex-1">
            <p class="font-medium text-gray-900">Rejoignez la conversation</p>
            <p class="text-sm text-gray-600">Connectez-vous pour partager votre avis</p>
          </div>
          <v-btn
            variant="flat"
            color="blue"
            @click="$router.push('/login')"
            size="small"
          >
            Se connecter
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Chargement des commentaires -->
    <div v-if="isLoading" class="p-8">
      <div class="flex items-center justify-center gap-3">
        <v-progress-circular indeterminate color="blue" size="24" />
        <span class="text-gray-600">Chargement des commentaires...</span>
      </div>
    </div>

    <!-- Liste des commentaires -->
    <div v-else-if="comments.length > 0" class="divide-y divide-gray-200">
      <div
        v-for="comment in comments"
        :key="comment._id"
        class="group p-6 hover:bg-gray-50 transition-colors duration-200"
      >
        <!-- En-tête du commentaire -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <v-avatar size="36" color="gray-500">
              <v-icon color="white" size="18">mdi-account</v-icon>
            </v-avatar>
            <div>
              <div class="font-medium text-gray-900">{{ comment.authorPseudo }}</div>
              <div class="text-sm text-gray-500 flex items-center gap-2">
                {{ formatDate(comment.createdAt) }}
                <span 
                  v-if="comment.updatedAt !== comment.createdAt" 
                  class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  modifié
                </span>
              </div>
            </div>
          </div>

          <!-- Actions du commentaire -->
          <div v-if="canManageComment(comment)" class="opacity-0 group-hover:opacity-100 transition-opacity">
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  size="small"
                  class="text-gray-400 hover:text-gray-600"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  v-if="isCommentAuthor(comment)"
                  @click="startEditComment(comment)"
                  prepend-icon="mdi-pencil"
                  title="Modifier"
                />
                <v-list-item
                  @click="confirmDeleteComment(comment)"
                  prepend-icon="mdi-delete"
                  title="Supprimer"
                  class="text-red-600"
                />
              </v-list>
            </v-menu>
          </div>
        </div>

        <!-- Contenu du commentaire -->
        <div class="ml-12">
          <!-- Mode édition -->
          <div v-if="editingComment?._id === comment._id">
            <v-textarea
              v-model="editContent"
              variant="outlined"
              rows="3"
              auto-grow
              :rules="[rules.required, rules.minLength]"
              counter="500"
              maxlength="500"
              class="mb-3"
            />
            <div class="flex justify-end gap-2">
              <v-btn
                variant="outlined"
                @click="cancelEdit"
                :disabled="isSubmitting"
                size="small"
              >
                Annuler
              </v-btn>
              <v-btn
                color="blue"
                @click="saveEditComment"
                :loading="isSubmitting"
                :disabled="!editContent.trim() || editContent.length < 3"
                size="small"
                variant="flat"
              >
                Sauvegarder
              </v-btn>
            </div>
          </div>
          
          <!-- Mode lecture -->
          <div v-else>
            <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucun commentaire -->
    <div v-else class="p-12 text-center">
      <v-icon size="48" color="gray-300">mdi-comment-outline</v-icon>
      <h4 class="text-lg font-medium text-gray-900 mt-4 mb-2">Aucun commentaire</h4>
      <p class="text-gray-600">
        Soyez le premier à partager votre avis sur cette ressource !
      </p>
    </div>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-lg overflow-hidden">
        <v-card-title class="bg-red-500 text-white px-6 py-4">
          <div class="flex items-center gap-2">
            <v-icon color="white">mdi-delete-alert</v-icon>
            Supprimer le commentaire
          </div>
        </v-card-title>
        <v-card-text class="p-6">
          <p class="text-gray-700">Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="deleteDialog = false"
            :disabled="isSubmitting"
          >
            Annuler
          </v-btn>
          <v-btn
            color="red"
            @click="deleteComment"
            :loading="isSubmitting"
            variant="flat"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Styles minimaux pour les composants Vuetify qui ne peuvent pas être stylés avec Tailwind */
.v-textarea :deep(.v-field) {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
}

/* Animation simple pour les commentaires */
.comment-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Effet hover pour les actions */
.p-6:hover .opacity-0 {
  opacity: 1;
}
</style> 