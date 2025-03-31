import type { UserData, TokenData } from '../models/models'

export interface Response {
  user?: UserData
  users?: UserData[]
  tokens?: TokenData
}
