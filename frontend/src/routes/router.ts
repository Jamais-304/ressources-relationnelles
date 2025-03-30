import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/accounts/Login.vue'
import Signup from '../views/accounts/Signup.vue'
// import User from '../views/users/User.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
  // The line below is an example of a route with a dynamic parameter (:id)
  // { path: '/users/:id', component: User },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
