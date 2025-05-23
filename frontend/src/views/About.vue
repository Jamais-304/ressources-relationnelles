<script setup lang="ts">
import AppButton from '@/components/common/AppButton.vue'
import { ref } from 'vue'

interface FaqItem {
  question: string
  answer: string
  isOpen: boolean
}

const faqItems = ref<FaqItem[]>([
  {
    question: "Qu'est-ce que (RE)SOURCES RELATIONNELLES ?",
    answer: "(RE)SOURCES RELATIONNELLES est une plateforme de partage d'informations et de ressources destinée aux citoyens français. Elle permet aux utilisateurs de partager des textes, fichiers et autres types d'informations utiles à la communauté.",
    isOpen: false
  },
  {
    question: "Comment puis-je utiliser cette plateforme ?",
    answer: "Pour utiliser pleinement (RE)SOURCES RELATIONNELLES, vous devez créer un compte utilisateur. Une fois connecté, vous pouvez consulter les ressources partagées, en ajouter de nouvelles, et interagir avec les autres utilisateurs de la plateforme.",
    isOpen: false
  },
  {
    question: "Quels types de ressources puis-je partager ?",
    answer: "Vous pouvez partager différents types de contenus : des articles, des documents, des liens vers des ressources externes, ou tout autre contenu susceptible d'intéresser la communauté. Tous les contenus doivent respecter nos conditions d'utilisation.",
    isOpen: false
  },
  {
    question: "Comment mes données sont-elles protégées ?",
    answer: "Nous accordons une importance capitale à la protection de vos données personnelles. Toutes les informations collectées sont traitées conformément aux lois et règlements sur la protection des données, notamment le RGPD. Pour plus de détails, consultez notre politique de confidentialité.",
    isOpen: false
  },
  {
    question: "Comment puis-je signaler un contenu inapproprié ?",
    answer: "Si vous constatez un contenu qui vous semble inapproprié ou contraire à nos conditions d'utilisation, vous pouvez le signaler aux administrateurs via le bouton de signalement disponible sur chaque ressource ou en contactant directement notre équipe de modération.",
    isOpen: false
  },
  {
    question: "Puis-je contribuer au développement de la plateforme ?",
    answer: "Nous sommes ouverts aux contributions ! Si vous avez des compétences en développement web, design, ou si vous souhaitez simplement proposer des améliorations, n'hésitez pas à nous contacter. Ensemble, nous pouvons faire évoluer cette plateforme pour mieux répondre aux besoins des utilisateurs.",
    isOpen: false
  }
])

const toggleFaq = (index: number) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen
}
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

            <!-- FAQ -->
     <section>
        <h2 class="text-xl font-bold mb-6 font-marianne">
          Foire aux questions
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="(item, index) in faqItems" 
            :key="index" 
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              :class="{ 'bg-[#F5F5FE] text-[#000091]': item.isOpen }"
            >
              <span class="font-medium">{{ item.question }}</span>
              <span class="text-xl">
                {{ item.isOpen ? '−' : '+' }}
              </span>
            </button>
            <div 
              v-if="item.isOpen" 
              class="p-4 bg-white border-t border-gray-200"
            >
              <p>{{ item.answer }}</p>
            </div>
          </div>
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