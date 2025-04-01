<script setup lang="ts">
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'

const { authUser } = storeToRefs(useAuthUserStore())
</script>

<template>
  <v-container>
    Bienvenue sur la page d’accueil !

    <v-card class="pa-4 ma-4" elevation="1" v-if="authUser">
      <div>Nom: {{ authUser?.username }}</div>
      <div>Role: {{ authUser?.role }}</div>
    </v-card>
  </v-container>
</template>
