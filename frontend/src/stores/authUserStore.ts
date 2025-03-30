import { Role, type User } from '@/api/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface AuthUser {
  username: string | null
  role: Role
  isAuthenticated: boolean
}

export const useAuthUserStore = defineStore('user', () => {
  const username = ref<string | null>(null)
  const role = ref<Role | null>(null)
  const isAuthenticated = ref<boolean>(false)

  const isAdmin = computed(() => {
    return role.value && role.value.includes(Role.Admin || Role.SuperAdmin)
  })

  function initializeFromSessionStorage() {
    try {
      const storedAuthUser = sessionStorage.getItem('authUser')
      if (storedAuthUser) {
        const {
          username: storedUsername,
          role: storedRole,
          isAuthenticated: storedIsAuthenticated,
        } = JSON.parse(storedAuthUser)

        username.value = storedUsername
        role.value = storedRole
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
      role: role.value,
      isAuthenticated: isAuthenticated.value,
    }
  }

  function setAuthUser(user: User) {
    username.value = user.username
    role.value = user.role
    isAuthenticated.value = true

    sessionStorage.setItem(
      'authUser',
      JSON.stringify({
        username: user.username,
        role: user.role,
        isAuthenticated: true,
      })
    )
  }

  function resetAuthUser() {
    username.value = null
    role.value = null
    isAuthenticated.value = false

    sessionStorage.removeItem('authUser')
  }

  return {
    username,
    role,
    isAuthenticated,
    isAdmin,
    initializeFromSessionStorage,
    setAuthUser,
    getAuthUser,
    resetAuthUser,
  }
})
