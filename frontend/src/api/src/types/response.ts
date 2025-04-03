import type { UserData, TokenData } from '../models/models'
import type { ResourceData } from '../models/resource'

export interface Response {
  message?: string
  data?: Data
  error?: []
}

interface Data {
  user?: UserData
  users?: UserData[]
  resource?: ResourceData
  resources?: ResourceData[]
  tokens?: TokenData
}
