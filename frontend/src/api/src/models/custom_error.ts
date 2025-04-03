import type { AxiosError } from 'axios'
import axios from 'axios'

export class CustomError extends Error {
  status?: number
  data: {
    error?: {
      msg?: string
      location?: string
      errors?: Array<{
        type?: string
        value?: string
        msg?: string
        path?: string
        location?: string
      }>
    }
  }
  multipleErrors: boolean = false

  constructor(message: string, axiosError: AxiosError) {
    super()

    this.message = message
    this.status = axiosError.response?.status
    this.data = axiosError.response?.data as this['data']

    if (this.data.error?.errors) {
      this.multipleErrors = true
    }
  }

  static handleError(message: string, error: unknown): never {
    if (axios.isAxiosError(error)) {
      throw new CustomError(message, error)
    } else {
      throw error
    }
  }
}
