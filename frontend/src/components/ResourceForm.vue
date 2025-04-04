<script setup lang="ts">
import { relationTypes } from '@/utils/relationTypes'
import { ref } from 'vue'

defineProps({
  showAuthor: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Créer',
  },
})

const categories = [
  {
    title: 'Santé mentale',
    value: 'sante_ementale',
  },
  {
    title: 'Sorties',
    value: 'sorties',
  },
  {
    title: 'À définir…',
    value: 'a_definir',
  },
]

const author = defineModel('author')
const title = defineModel('username')
const relationType = defineModel('relationType')
const category = defineModel('category')
const file = defineModel('file', { type: File })

const emit = defineEmits(['save'])

const validResourceForm = ref(false)

const notNull = [(v: string) => !!v || 'Ce champ ne peut pas être vide.']

function setFileToUpload(event: Event) {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0]
}

async function save() {
  if (!validResourceForm.value) {
    return
  }
  emit('save')
}
</script>

<template>
  <v-form v-model="validResourceForm" lazy-validation @submit.prevent="save">
    <v-container>
      <div class="flex flex-col w-[20vw]">
        <v-text-field
          v-if="showAuthor"
          v-model="author"
          label="Auteur"
          :rules="notNull"
        />

        <v-text-field v-model="title" label="Titre" :rules="notNull" />

        <v-select
          label="Type de relation"
          v-model="relationType"
          :items="relationTypes"
          :rules="notNull"
        />

        <v-select
          label="Catégorie"
          v-model="category"
          :items="categories"
          :rules="notNull"
        />

        <v-file-input
          label="Ajouter un fichier"
          accept="image/png, image/jpg, .pdf, .txt, .docx"
          @change="setFileToUpload"
        />
      </div>
    </v-container>

    <v-card-actions>
      <v-btn type="submit">{{ buttonText }}</v-btn>
    </v-card-actions>
  </v-form>
</template>
