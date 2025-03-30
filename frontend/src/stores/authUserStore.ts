import { Role, type User } from '@/api/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface AuthUser {
  username: string | null
  roles: Role[]
  isAuthenticated: boolean
}

export const useAuthUserStore = defineStore('user', () => {
  const username = ref<string | null>(null)
  const roles = ref<Role[]>([])
  const isAuthenticated = ref<boolean>(false)

  const isAdmin = computed(() => {
    return roles.value.includes(Role.Admin)
  })

  function initializeFromSessionStorage() {
    try {
      const storedAuthUser = sessionStorage.getItem('authUser')
      if (storedAuthUser) {
        const {
          username: storedUsername,
          roles: storedRoles,
          isAuthenticated: storedIsAuthenticated,
        } = JSON.parse(storedAuthUser)

        username.value = storedUsername
        roles.value = storedRoles
        isAuthenticated.value = storedIsAuthenticated
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error)
      localStorage.removeItem('authUser')
    }
  }

  function getAuthUser() {
    return {
      username: username.value,
      roles: roles.value,
      isAuthenticated: isAuthenticated.value,
    }
  }

  function setAuthUser(user: User) {
    username.value = user.username
    roles.value = user.roles
    isAuthenticated.value = true

    sessionStorage.setItem(
      'authUser',
      JSON.stringify({
        username: user.username,
        roles: user.roles,
        isAuthenticated: true,
      })
    )
  }

  function resetAuthUser() {
    username.value = null
    roles.value = []
    isAuthenticated.value = false

    sessionStorage.removeItem('authUser')
  }

  return {
    username,
    roles,
    isAuthenticated,
    isAdmin,
    initializeFromSessionStorage,
    setAuthUser,
    getAuthUser,
    resetAuthUser,
  }
})
