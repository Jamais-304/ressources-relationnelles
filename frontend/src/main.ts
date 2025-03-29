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

const pinia = createPinia()
const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
})

app
  .use(pinia)
  .use(router)
  .use(Vue3Toastify, { autoClose: 2500, clearOnUrlChange: false })
  .use(vuetify)
  .mount('#app')
