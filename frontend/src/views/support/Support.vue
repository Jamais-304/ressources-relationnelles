<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import { GitHubIssueService } from '@/github-api/GitHubIssueService'
import { toast } from 'vue3-toastify'

const valid = ref(false)
const username = ref('')
const email = ref('')
const title = ref('')
const description = ref('')

const usernameRules = ref([
        (value: string | undefined) => {
          if (value) return true

          return 'Le nom d’utilisateur est requis.'
        },
        (value: string) => {
          console.log(value)
          if (value?.length <= 40) return true

          return 'Le nom d’utilisateur doit faire moins de 40 caractères.'
        },
      ])

const emailRules = ref([
        (value: string | undefined) => {
          if (value) return true

          return 'L’email est requis.'
        },
        (value: string) => {
          if (/.+@.+\..+/.test(value)) return true

          return 'Le format de l’email doit être valide.'
        },
      ])

const titleRules = ref([
        (value: string | undefined) => {
          if (value) return true

          return 'Le titre est requis.'
        },
        (value: string) => {
          console.log(value)
          if (value?.length >= 5) return true

          return 'La description doit faire au moins 5 caractères.'
        },
      ])

const descriptionRules = ref([
        (value: string | undefined) => {
          if (value) return true

          return 'La description est requise.'
        },
        (value: string) => {
          console.log(value)
          if (value?.length >= 20) return true

          return 'La description doit faire au moins 20 caractères.'
        },
      ])

function handleFormSubmission() {
  if (!valid.value) {
    return
  }

  createIssue()
}

async function createIssue() {
  const githubApi = new GitHubIssueService()
  const apiResponse = await githubApi.createUserIssue(
    username.value,
    email.value,
    title.value,
    description.value,
  )

  if (apiResponse.state === 'open') {
    toast.success('Demande transmise avec succès ! Notre équipe support reviendra rapidement vers vous.')
  } else {
    toast.error("Erreur lors de l’envoi de votre demande. Vous pouvez nous écrire sur 'support@rr.fr'.")
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="bg-white p-12 rounded-lg border border-[#E5E5E5]">
      <h1 class="text-2xl font-bold mb-6 font-marianne">
        Support de (RE)SOURCES RELATIONNELLES
      </h1>

      <section class="mb-12">
        <div class="bg-[#F5F5FE] p-6 rounded-lg border border-[#000091]/20">
          <h2 class="text-xl font-bold mb-4 font-marianne text-[#000091]">
            Toujours à votre écoute
          </h2>
          Pour déclarer toute anomalie ou solliciter de l’aide pour des sujets
          non traités dans la page <a class="underline" href="about">à propos</a>, vous pouvez nous écrire via le
          formulaire ci-dessous.
          Nous étudierons votre demande et vous répondrons dans les meilleurs délais.
        </div>
      </section>


      <section>
        <h2 class="text-xl font-bold mb-6 font-marianne">
          Formulaire de contact
        </h2>
          <v-form
            v-model="valid"
            @submit.prevent="handleFormSubmission"
          >
            <v-row>
              <v-col cols="8" md="6">
                <v-text-field
                  v-model="username"
                  :counter="40"
                  :rules="usernameRules"
                  label="Nom d’utilisateur"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="8" md="6">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
              <v-text-field
                  v-model="title"
                  :rules="titleRules"
                  label="Titre"
                  required
              >
              <template #counter="counter">
                  {{ counter.value }} caractères
                </template>
            </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="description"
                  :rules="descriptionRules"
                  label="Description"
                  required
                >
                <template #counter="counter">
                  {{ counter.value }} caractères
                </template>
              </v-textarea>
              </v-col>
            </v-row>

            <v-btn
              class="mt-2"
              type="submit"
              block
            >Envoyer
            </v-btn>
          </v-form>
        </section>

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
