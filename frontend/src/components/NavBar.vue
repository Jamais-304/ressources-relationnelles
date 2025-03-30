<script setup lang="ts">
import { removeToken } from '../utils/cookies'
import { useAuthUserStore } from '../stores/authUserStore'
import { storeToRefs } from 'pinia'

const authUserStore = useAuthUserStore()
const { isAuthenticated } = storeToRefs(authUserStore)
const { resetAuthUser } = authUserStore

async function logout() {
  resetAuthUser()
  removeToken('accessToken')
  removeToken('refreshToken')
  removeToken('tokenExpiryTime')
}
</script>

<template>
  <v-app-bar elevation="1">
    <v-app-bar-nav-icon icon="mdi-home" href="/"></v-app-bar-nav-icon>
    <v-app-bar-title>(RE)SOURCES RELATIONNELLES</v-app-bar-title>
    <div class="mr-4">
      <v-btn class="mr-2">
        <RouterLink to="/about">À propos</RouterLink>
      </v-btn>
      <v-btn v-if="!isAuthenticated" class="mr-2">
        <RouterLink to="/login">login</RouterLink>
      </v-btn>
      <v-btn v-else class="mr-2" @click="logout">
        <RouterLink to="/">logout</RouterLink></v-btn
      >
    </div>
  </v-app-bar>
</template>
