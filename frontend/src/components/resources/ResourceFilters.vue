<template>
  <v-card class="mb-6" variant="outlined">
    <v-card-text>
      <v-row align="center">
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="searchQuery"
            @update:model-value="$emit('update:searchQuery', $event)"
            placeholder="Rechercher une ressource..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="selectedStatus"
            @update:model-value="$emit('update:selectedStatus', $event)"
            :items="[
              { value: 'ALL', title: 'Toutes' },
              { value: 'PENDING', title: 'En attente' },
              { value: 'PUBLISHED', title: 'Publiées' },
              { value: 'DRAFT', title: 'Brouillons' }
            ]"
            item-value="value"
            item-title="title"
            label="Filtrer par statut"
            prepend-inner-icon="mdi-filter"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  searchQuery: string
  selectedStatus: string
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedStatus': [value: string]
}>()
</script> 