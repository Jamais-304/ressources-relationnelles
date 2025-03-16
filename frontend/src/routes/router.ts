import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
// import User from '../views/users/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  // The line below is an example of a route with a dynamic parameter (:id)
  // { path: '/users/:id', component: User },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
