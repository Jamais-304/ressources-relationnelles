import { Role, type User } from '@/api/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface AuthUser {
  username: string | null
  role: Role
  isAuthenticated: boolean
}

export const useAuthUserStore = defineStore('user', () => {
  const authUser = ref<User>()
  const isAuthenticated = ref<boolean>(false)

  const isAdmin = computed(() => {
    console.log('🔍 DEBUG - Checking isAdmin for user:', authUser.value?.role)
    return (
      authUser.value &&
      (authUser.value.role === Role.Admin || authUser.value.role === Role.SuperAdmin)
    )
  })

  function initializeFromSessionStorage() {
    try {
      const storedAuthData = sessionStorage.getItem('authUser')
      if (storedAuthData) {
        const {
          authUser: storedAuthUser,
          isAuthenticated: storedIsAuthenticated,
        } = JSON.parse(storedAuthData)

        authUser.value = storedAuthUser
        isAuthenticated.value = storedIsAuthenticated
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error)
      localStorage.removeItem('authUser')
    }
  }

  function getAuthUser() {
    return {
      authUser: authUser.value,
      isAuthenticated: isAuthenticated.value,
    }
  }

  function setAuthUser(user: User) {
    authUser.value = user
    isAuthenticated.value = true

    sessionStorage.setItem(
      'authUser',
      JSON.stringify({
        authUser: user,
        isAuthenticated: true,
      })
    )
  }
                                                                                    
  function resetAuthUser() {
    authUser.value = undefined
    isAuthenticated.value = false

    sessionStorage.removeItem('authUser')
  }

  return {
    authUser,
    isAuthenticated,
    isAdmin,
    initializeFromSessionStorage,
    setAuthUser,
    getAuthUser,
    resetAuthUser,
  }
})
