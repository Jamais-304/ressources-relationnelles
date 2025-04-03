import { CustomError } from '@/api/api'
import { toast } from 'vue3-toastify'

export function useErrorsManagement() {
  function handleError(error: unknown) {
    if (error instanceof CustomError) {
      toast.error(`Erreur: ${error.data?.error?.msg}`)
    } else {
      console.error(error)
    }
  }
  return { handleError }
}
