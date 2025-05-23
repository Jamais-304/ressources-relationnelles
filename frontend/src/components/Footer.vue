<script setup lang="ts">
import { useRouter } from 'vue-router'
import logo from '../assets/logo.svg'
import AppButton from './common/AppButton.vue'

const router = useRouter()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="w-full bg-white border-t border-gray-200 mt-auto">
    <!-- Section principale -->
    <div class="w-full bg-[#000091] text-white py-6">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Logo et nom du projet -->
          <div class="flex flex-col">
            <div class="flex items-center gap-4 mb-4">
              <img :src="logo" alt="Logo Marianne" class="h-8 w-8" />
              <span class="text-lg font-bold font-marianne">(RE)SOURCES RELATIONNELLES</span>
            </div>
            <p class="text-sm font-marianne mt-2">
              Plateforme de partage de ressources relationnelles pour les professionnels.
            </p>
          </div>

          <!-- Liens rapides -->
          <div class="flex flex-col">
            <h3 class="text-md font-marianne font-bold mb-4">Liens rapides</h3>
            <div class="flex flex-col gap-2">
              <AppButton
                variant="text"
                color="white"
                class="!text-sm !justify-start !p-0 hover:!bg-transparent hover:!underline"
                to="/"
              >
                Accueil
              </AppButton>
              <AppButton
                variant="text"
                color="white"
                class="!text-sm !justify-start !p-0 hover:!bg-transparent hover:!underline"
                to="/about"
              >
                À propos
              </AppButton>
            </div>
          </div>

          <!-- Contact -->
          <div class="flex flex-col">
            <h3 class="text-md font-marianne font-bold mb-4">Contact</h3>
            <p class="text-sm font-marianne">
              Pour toute question, n'hésitez pas à nous contacter.
            </p>
            <a 
              href="mailto:contact@ressources-relationnelles.fr" 
              class="text-sm font-marianne mt-2 hover:underline"
            >
              contact@ressources-relationnelles.fr
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Sous-footer avec mentions légales -->
    <div class="w-full bg-[#F5F5FE] py-3">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-xs text-gray-600 font-marianne">
            {{ currentYear }} (RE)SOURCES RELATIONNELLES. Tous droits réservés.
          </div>
          <div class="flex gap-4 mt-2 md:mt-0">
            <a href="#" class="text-xs text-gray-600 hover:text-[#000091] hover:underline font-marianne">Mentions légales</a>
            <a href="#" class="text-xs text-gray-600 hover:text-[#000091] hover:underline font-marianne">Politique de confidentialité</a>
            <a href="#" class="text-xs text-gray-600 hover:text-[#000091] hover:underline font-marianne">Accessibilité</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>

    <!-- TODO : Ajouter les liens vers les mentions légales, politique de confidentialité et accessibilité, et revoir les boutons -->

   <!--  Deuxieme TODO a voir ensemble Page contact ??? -->


