<script setup lang="ts">
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'

const { username, roles } = storeToRefs(useAuthUserStore())
</script>

<template>
  <v-container>
    Bienvenue sur la page d’accueil !

    <v-card class="pa-4 ma-4" elevation="1" v-if="username">
      <div>Nom: {{ username }}</div>
      <div>
        Roles:
        <template v-for="(role, index) in roles" :key="index">
          <span v-if="index < roles.length - 1"> {{ role }},</span>
          <span v-else> {{ role }} </span>
        </template>
      </div>
    </v-card>
  </v-container>
</template>
