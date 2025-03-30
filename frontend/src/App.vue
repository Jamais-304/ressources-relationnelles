<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { RouterView } from 'vue-router'
import { useAuthUserStore } from './stores/authUserStore'
import { onMounted } from 'vue'

const { initializeFromSessionStorage } = useAuthUserStore()

onMounted(() => initializeFromSessionStorage())
</script>

<template>
  <v-app>
    <header>
      <NavBar />
    </header>
    <v-main class="mt-10">
      <RouterView />
    </v-main>
  </v-app>
</template>
