import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/accounts/Login.vue'
import Signup from '../views/accounts/Signup.vue'
import NotAllowed from '@/views/NotAllowed.vue'
import { useAuthUserStore } from '@/stores/authUserStore'
// import User from '../views/users/User.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/not-allowed', name: 'not allowed', component: NotAllowed },
  // The line below is an example of a route with a dynamic parameter (:id)
  // { path: '/users/:id', component: User },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from) => {
  const { isAuthenticated, isAdmin } = useAuthUserStore()
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    console.log('test')
    return { name: 'not allowed' }
  }
})

export default router
