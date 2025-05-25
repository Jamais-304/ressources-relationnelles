<script setup lang="ts">
import { Api, RelationType } from '@/api/api'
import ResourceForm from '@/components/ResourceForm.vue'
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const api = new Api()
const router = useRouter()

const { authUser } = storeToRefs(useAuthUserStore())

const title = ref('')
const relationType = ref<RelationType>()
const category = ref('')
const file = ref<File>()
const content = ref('')
const isLoading = ref(false)

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
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- En-tête de page -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        ✨ Créer une nouvelle ressource
      </h1>
      <p class="text-gray-600">
        Partagez vos connaissances, expériences ou outils utiles avec la communauté
      </p>
    </div>

    <!-- Formulaire dans une carte -->
    <v-card elevation="2" class="rounded-lg">
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
        height="3"
      />
      
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
    </v-card>
  </div>
</template>

<style scoped>
/* Styles spécifiques si nécessaires */
</style>
