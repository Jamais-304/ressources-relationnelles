<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import { ref } from 'vue'

</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="bg-white p-12 rounded-lg border border-[#E5E5E5]">
      <h1 class="text-2xl font-bold mb-6 font-marianne">
        À propos de (RE)SOURCES RELATIONNELLES
      </h1>
      
      <!-- Présentation du projet dans sa globalité -->
      <section class="mb-12">
        <div class="bg-[#F5F5FE] p-6 rounded-lg border border-[#000091]/20">
          <h2 class="text-xl font-bold mb-4 font-marianne text-[#000091]">
            Notre mission
          </h2>
          <p class="mb-4">
            (RE)SOURCES RELATIONNELLES est une plateforme numérique citoyenne qui a pour mission de faciliter le partage d'informations et de ressources entre les citoyens français.
          </p>
          <p class="mb-4">
            Dans un monde où l'information est abondante mais parfois difficile à trouver ou à vérifier, notre plateforme propose un espace organisé et collaboratif où chacun peut contribuer et bénéficier des connaissances collectives.
          </p>
          <p>
            Que vous soyez à la recherche de ressources spécifiques ou que vous souhaitiez partager votre expertise, (RE)SOURCES RELATIONNELLES est l'espace idéal pour créer du lien et valoriser les savoirs de chacun.
          </p>
        </div>
      </section>



      <!-- Rejoindre la communauté -->
      <section class="mt-12 text-center p-6 bg-[#000091]/5 rounded-lg">
        <h2 class="text-xl font-bold mb-4 font-marianne">
          Rejoignez notre communauté
        </h2>
        <p class="mb-6">
          Participez à cette initiative citoyenne et contribuez à enrichir notre base de ressources communes.
        </p>
        <div class="flex gap-4 justify-center">
          <AppButton
            to="/signup"
            color="primary"
            variant="elevated"
            class="!bg-[#000091] !text-white"
          >
            S'inscrire
          </AppButton>
          <AppButton
            to="/login"
            variant="outlined"
            class="!text-[#000091]"
          >
            Se connecter
          </AppButton>
        </div>
      </section>

      <!-- Lien de retour -->
      <div class="mt-8 text-center">
        <AppButton
          to="/"
          variant="text"
          icon="mdi-arrow-left"
          class="!text-[#000091]"
        >
          Retour à l'accueil
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
</style>


      <!-- TODO : A revoir la phrase de presentation -->