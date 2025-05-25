import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/accounts/Login.vue'
import Signup from '../views/accounts/Signup.vue'
import Users from '@/views/users/Users.vue'
import User from '@/views/users/User.vue'
import NotAllowed from '@/views/NotAllowed.vue'
import { useAuthUserStore } from '@/stores/authUserStore'
import MyAccount from '@/views/accounts/MyAccount.vue'
import Resources from '@/views/resources/Resources.vue'
import CreateResource from '@/views/resources/CreateResource.vue'
import ResourceModeration from '@/views/resources/ResourceModerationV2.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/about', name: 'about', component: About },
  { path: '/login', name: 'login', component: Login },
  { path: '/signup', name: 'signup', component: Signup },
  { path: '/not-allowed', name: 'not allowed', component: NotAllowed },
  {
    path: '/users',
    name: 'users list',
    component: Users,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/users/:uuid',
    name: 'show user',
    component: User,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: '/my-account',
    name: 'my account',
    component: MyAccount,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/resources',
    name: 'list resources',
    component: Resources,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/create-resource',
    name: 'create resource',
    component: CreateResource,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/resources/moderation',
    name: 'resource moderation',
    component: ResourceModeration,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
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
