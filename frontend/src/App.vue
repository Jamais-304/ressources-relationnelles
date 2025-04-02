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
    <v-main class="bg-[#F6F6F6]">
      <div class="mt-[96px]">
        <RouterView />
      </div>
    </v-main>
  </v-app>
</template>
