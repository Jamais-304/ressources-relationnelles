<script setup lang="ts">
import { Api, RelationType } from '@/api/api'
import ResourceForm from '@/components/ResourceForm.vue'
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const api = new Api()

const { authUser } = storeToRefs(useAuthUserStore())

const title = ref('')
const relationType = ref<RelationType>()
const category = ref('')
const file = ref<File>()

function createResource() {
  const authorUuid = authUser.value?.uuid || 'test'

  const attrs = {
    authorUuid: authorUuid,
    title: title.value,
    relationType: relationType.value,
    category: category.value,
    file: file.value,
    status: 'toDefine',
  }

  api.resources.create(attrs)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="bg-white p-12 rounded-lg border border-[#E5E5E5]">
      <ResourceForm
        v-model:title="title"
        v-model:relation-type="relationType"
        v-model:category="category"
        v-model:file="file"
        @save="createResource"
      />
    </div>
  </div>
</template>
