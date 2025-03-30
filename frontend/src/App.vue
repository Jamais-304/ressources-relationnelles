<script setup lang="ts">
import { RouterView } from 'vue-router'
import { removeToken } from './utils/cookies'

function logout() {
  removeToken('accessToken')
  removeToken('refreshToken')
  removeToken('tokenExpiryTime')
}
</script>

<template>
  <v-app>
    <header>
      <v-app-bar elevation="1">
        <v-app-bar-nav-icon icon="mdi-home" href="/"></v-app-bar-nav-icon>
        <v-app-bar-title>(RE)SOURCES RELATIONNELLES</v-app-bar-title>
        <div class="mr-4">
          <v-btn class="mr-2">
            <RouterLink to="/about">À propos</RouterLink>
          </v-btn>
          <v-btn class="mr-2">
            <RouterLink to="/login">login</RouterLink>
          </v-btn>
          <v-btn class="mr-2" @click="logout">
            <RouterLink to="/">logout</RouterLink>
          </v-btn>
        </div>
      </v-app-bar>
    </header>

    <v-main class="mt-10">
      <RouterView></RouterView>
    </v-main>
  </v-app>
</template>
