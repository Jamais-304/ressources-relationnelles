import type { UserData, TokenData } from '../models/models'

export interface Response {
  user?: UserData
  tokens?: TokenData
}
