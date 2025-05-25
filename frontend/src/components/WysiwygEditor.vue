<template>
  <div class="wysiwyg-editor">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    
    <QuillEditor
      ref="quillRef"
      :content="content"
      :options="quillOptions"
      content-type="html"
      @update:content="onContentChange"
      @ready="onEditorReady"
      @focus="onFocus"
      @blur="onBlur"
      class="min-h-[300px] bg-white border border-gray-300 rounded-lg"
    />
    
    <!-- Compteur de caractères -->
    <div class="flex justify-between items-center mt-2 text-sm text-gray-500">
      <span>{{ characterCount }} caractères</span>
      <span v-if="maxLength">{{ characterCount }}/{{ maxLength }}</span>
    </div>
    
    <!-- Erreur de validation -->
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import 'quill/dist/quill.snow.css'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  maxLength?: number
  required?: boolean
  readonly?: boolean
  theme?: 'snow' | 'bubble'
  uploadEndpoint?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  theme: 'snow',
  placeholder: 'Écrivez votre contenu ici...',
  uploadEndpoint: '/api/v1/resource/upload-image'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [editor: any]
  'blur': [editor: any]
  'ready': [editor: any]
  'change': [{ html: string, text: string, delta: any }]
}>()

const quillRef = ref<InstanceType<typeof QuillEditor>>()
const content = ref(props.modelValue)
const error = ref('')

// Configuration avancée de Quill
const quillOptions = computed(() => ({
  theme: props.theme,
  readOnly: props.readonly,
  placeholder: props.placeholder,
  modules: {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        // Handler personnalisé pour les images
        image: () => {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          input.click()

          input.onchange = () => {
            const file = input.files?.[0]
            if (file) {
              uploadImage(file)
            }
          }
        }
      }
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  },
  formats: [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'check',
    'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ]
}))

// Compteur de caractères
const characterCount = computed(() => {
  if (!content.value) return 0
  // Retirer les balises HTML pour compter seulement le texte
  const textOnly = content.value.replace(/<[^>]*>/g, '')
  return textOnly.length
})

// Fonction d'upload d'image
async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(props.uploadEndpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Adapter selon votre auth
      }
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image')
    }

    const result = await response.json()
    
    // Insérer l'image dans l'éditeur
    const quill = getEditor()
    if (quill) {
      const range = quill.getSelection()
      quill.insertEmbed(range ? range.index : 0, 'image', result.imageUrl)
    }
    
    return result.imageUrl
  } catch (error) {
    console.error('Erreur upload image:', error)
    throw error
  }
}

// Gestion des événements
function onContentChange(content: string) {
  // Validation de longueur
  if (props.maxLength && characterCount.value > props.maxLength) {
    error.value = `Le contenu dépasse la limite de ${props.maxLength} caractères`
  } else if (props.required && !content.trim()) {
    error.value = 'Ce champ est requis'
  } else {
    error.value = ''
  }

  emit('update:modelValue', content)
}

function onEditorReady(editor: any) {
  emit('ready', editor)
}

function onFocus(editor: any) {
  emit('focus', editor)
}

function onBlur(editor: any) {
  emit('blur', editor)
}

// Watcher pour la synchronisation
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== content.value) {
      content.value = newValue
    }
  }
)

// Méthodes exposées
function getEditor(): any {
  return quillRef.value?.getQuill()
}

function focus() {
  nextTick(() => {
    quillRef.value?.getQuill()?.focus()
  })
}

function insertText(text: string, index?: number) {
  const quill = quillRef.value?.getQuill()
  if (quill) {
    const insertIndex = index ?? quill.getLength()
    quill.insertText(insertIndex, text)
  }
}

function insertEmbed(type: string, value: any, index?: number) {
  const quill = quillRef.value?.getQuill()
  if (quill) {
    const insertIndex = index ?? quill.getLength()
    quill.insertEmbed(insertIndex, type, value)
  }
}

defineExpose({
  getEditor,
  focus,
  insertText,
  insertEmbed
})
</script>

<style>
/* Personnalisation du thème Quill */
.ql-toolbar {
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: #f9fafb;
}

.ql-container {
  border-bottom: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ql-editor {
  min-height: 200px;
  font-size: 14px;
  line-height: 1.6;
}

.ql-editor.ql-blank::before {
  font-style: normal;
  color: #9ca3af;
}

/* Amélioration de l'apparence des boutons de toolbar */
.ql-toolbar .ql-formats {
  margin-right: 15px;
}

.ql-toolbar button:hover {
  color: #3b82f6;
}

.ql-toolbar button.ql-active {
  color: #1d4ed8;
}
</style> 