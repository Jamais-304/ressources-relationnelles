<template>
  <v-row class="mb-6">
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4 text-center" color="primary" variant="tonal">
        <div class="text-h4 font-weight-bold">{{ resourcesCount.all }}</div>
        <div class="text-caption">Total</div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-card class="pa-4 text-center" color="warning" variant="tonal">
        <div class="text-h4 font-weight-bold">{{ resourcesCount.pending }}</div>
        <div class="text-caption">En attente</div>
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
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Resource } from '@/composables/useResourceHelpers'

const props = defineProps<{
  resources: Resource[]
}>()

const resourcesCount = computed(() => ({
  all: props.resources.length,
  draft: props.resources.filter((r: Resource) => r.status === 'DRAFT').length,
  pending: props.resources.filter((r: Resource) => r.status === 'PENDING').length,
  published: props.resources.filter((r: Resource) => r.status === 'PUBLISHED').length,
}))
</script> 