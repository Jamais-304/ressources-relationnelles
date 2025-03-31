import type { UserData, TokenData } from '../models/models'

export interface Response {
  message?: string
  data?: Data
  error?: []
}

interface Data {
  user?: UserData
  users?: UserData[]
  tokens?: TokenData
}
