import './assets/main.css'

import App from './App.vue'
import router from './routes/router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fr } from 'vuetify/locale'

const pinia = createPinia()
const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'fr',
    fallback: 'fr',
    messages: {
      fr: {
        ...fr,
        dataFooter: {
          itemsPerPageText: 'Éléments par page',
          itemsPerPageAll: 'Tous',
          nextPage: 'Page suivante',
          prevPage: 'Page précédente',
          firstPage: 'Première page',
          lastPage: 'Dernière page',
          pageText: '{0}-{1} sur {2}',
        },
        noDataText: 'Aucune donnée disponible',
        loading: 'Chargement...',
      },
    },
  },
})

app
  .use(pinia)
  .use(router)
  .use(Vue3Toastify, { autoClose: 2500, clearOnUrlChange: false })
  .use(vuetify)
  .mount('#app')
