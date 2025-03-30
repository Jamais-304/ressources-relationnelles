<script setup lang="ts">
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'

const { username, role } = storeToRefs(useAuthUserStore())
</script>

<template>
  <v-container>
    Bienvenue sur la page d’accueil !

    <v-card class="pa-4 ma-4" elevation="1" v-if="username">
      <div>Nom: {{ username }}</div>
      <div>Role: {{ role }}</div>
    </v-card>
  </v-container>
</template>
