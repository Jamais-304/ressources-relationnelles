import { Resource } from '@/api/api'
import { ref } from 'vue'

// NOTE: references defined before the function scope are globally accessible.
// https://vuejs.org/guide/scaling-up/state-management.html#state-management

const resources = ref<Resource[]>()
const currentResource = ref<Resource>()

export function useResourcesManagement() {
  return {
    references: { resources, currentResource },
  }
}
