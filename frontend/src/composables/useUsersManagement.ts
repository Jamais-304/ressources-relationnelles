import { User } from '@/api/api'
import { ref } from 'vue'

// NOTE: references defined before the function scope are globally accessible.
// https://vuejs.org/guide/scaling-up/state-management.html#state-management

const users = ref<User[]>()
const currentUser = ref<User>()

export function useUsersManagement() {
  return {
    references: { users, currentUser },
  }
}
