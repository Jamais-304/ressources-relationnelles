<script setup lang="ts">
import { useAuthUserStore } from '@/stores/authUserStore'
import { storeToRefs } from 'pinia'

const { authUser } = storeToRefs(useAuthUserStore())
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="bg-white p-12 rounded-lg border border-[#E5E5E5]">
      <h1 class="text-2xl font-bold mb-6">
        Bienvenue sur (RE)SOURCES RELATIONNELLES
      </h1>

      <div v-if="authUser" class="mt-6 p-6 bg-gray-50 rounded-lg">
        <div>Nom : {{ authUser?.username }}</div>
        <div>Rôle : {{ authUser?.role }}</div>
      </div>

      <div v-else class="mt-6">
        <p class="mb-6">Connectez-vous pour accéder à toutes les fonctionnalités.</p>
        <div class="flex gap-4">
          <v-btn
            to="/login"
            class="!bg-[#000091] !text-white"
          >
            Se connecter
          </v-btn>
          <v-btn
            to="/signup"
            variant="outlined"
            class="!text-[#000091]"
          >
            S'inscrire
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
