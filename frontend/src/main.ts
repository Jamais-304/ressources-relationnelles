import './assets/main.css'

import App from './App.vue'
import router from './routes/router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, { autoClose: 2500, clearOnUrlChange: false })
app.mount('#app')
