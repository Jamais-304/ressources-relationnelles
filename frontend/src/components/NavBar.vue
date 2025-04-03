<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '../stores/authUserStore'
import { storeToRefs } from 'pinia'
import logo from '../assets/logo.svg'
import AppButton from './common/AppButton.vue'
import { removeToken } from '@/utils/cookies'

const router = useRouter()
const authUserStore = useAuthUserStore()
const { isAuthenticated, isAdmin } = storeToRefs(authUserStore)

const logout = async () => {
  authUserStore.resetAuthUser()
  removeToken('accessToken')
  removeToken('refreshToken')
  removeToken('tokenExpiryTime')
  router.push('/')
}
</script>

<template>
  <div class="w-full fixed top-0 left-0 right-0 z-[1000]">
    <div class="w-full bg-[#000091] text-white">
      <div class="w-full px-4 py-2">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <img :src="logo" alt="Logo Marianne" class="h-8 w-8" />
            <span class="text-lg font-bold font-marianne"
              >(RE)SOURCES RELATIONNELLES</span
            >
          </div>
          <AppButton
            v-if="isAdmin"
            variant="text"
            color="white"
            class="!text-sm hover:!bg-[#1212ff]"
            to="/users"
          >
            Gestion des utilisateurs
          </AppButton>
          <div class="flex gap-2">
            <AppButton
              v-if="isAuthenticated"
              variant="text"
              color="white"
              class="!text-sm hover:!bg-[#1212ff]"
              to="/my-account"
            >
              Mon compte
            </AppButton>
            <AppButton
              v-if="!isAuthenticated"
              variant="text"
              color="white"
              class="!text-sm hover:!bg-[#1212ff]"
              to="/login"
            >
              Se connecter
            </AppButton>
            <AppButton
              v-if="!isAuthenticated"
              variant="text"
              color="white"
              class="!text-sm hover:!bg-[#1212ff]"
              to="/signup"
            >
              S'inscrire
            </AppButton>
            <AppButton
              v-if="isAuthenticated"
              variant="text"
              color="white"
              class="!text-sm hover:!bg-[#1212ff]"
              @click="logout"
              to="/"
            >
              Se déconnecter
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full bg-white shadow-sm">
      <div class="w-full px-4">
        <nav class="flex gap-4">
          <AppButton
            variant="text"
            color="default"
            class="!text-sm hover:!bg-[#F5F5FE] hover:!text-[#000091]"
            to="/"
          >
            Accueil
          </AppButton>
          <AppButton
            variant="text"
            color="default"
            class="!text-sm hover:!bg-[#F5F5FE] hover:!text-[#000091]"
            to="/about"
          >
            À propos
          </AppButton>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>
