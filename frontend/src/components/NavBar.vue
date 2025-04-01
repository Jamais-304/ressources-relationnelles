<script setup lang="ts">
import { removeToken } from '../utils/cookies'
import { useAuthUserStore } from '../stores/authUserStore'
import { storeToRefs } from 'pinia'
import logo from '../assets/logo.svg'
import AppButton from './common/AppButton.vue'

const authUserStore = useAuthUserStore()
const { isAuthenticated } = storeToRefs(authUserStore)
const { isAdmin } = storeToRefs(authUserStore)
const { resetAuthUser } = authUserStore

async function logout() {
  resetAuthUser()
  removeToken('accessToken')
  removeToken('refreshToken')
  removeToken('tokenExpiryTime')
}
</script>

<template>
  <div class="w-full fixed top-0 left-0 right-0 z-[1000]">
    <div class="w-full bg-[#000091] text-white py-3">
      <div class="w-full px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-6">
            <img :src="logo" alt="Logo Marianne" class="h-16 w-auto" />
            <span class="text-xl font-bold font-marianne text-white">(RE)SOURCES RELATIONNELLES</span>
          </div>
          <AppButton 
          v-if="isAdmin" 
          variant="text"
          color="white"
          class="hover:!bg-[#1212ff]"
          to="/users"
          >
            Gestion des utilisateurs
          </AppButton>
          <div class="flex gap-4">
            <AppButton
              v-if="!isAuthenticated"
              variant="text"
              color="white"
              class="hover:!bg-[#1212ff]"
              to="/login"
            >
              Se connecter
            </AppButton>
            <AppButton
              v-if="!isAuthenticated"
              variant="text"
              color="white"
              class="hover:!bg-[#1212ff]"
              to="/signup"
            >
              S'inscrire
            </AppButton>
            <AppButton
              v-else
              variant="text"
              color="white"
              class="hover:!bg-[#1212ff]"
              @click="logout"
              to="/"
            >
              Se déconnecter
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full bg-white border-b border-[#E5E5E5]">
      <div class="w-full px-8">
        <nav class="flex gap-6 py-2">
          <AppButton
            variant="text"
            color="default"
            class="hover:!bg-[#F5F5FE] hover:!text-[#000091]"
            to="/"
            icon="mdi-home"
          >
            Accueil
          </AppButton>
          <AppButton
            variant="text"
            color="default"
            class="hover:!bg-[#F5F5FE] hover:!text-[#000091]"
            to="/about"
          >
            À propos
          </AppButton>
        </nav>
      </div>
    </div>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
