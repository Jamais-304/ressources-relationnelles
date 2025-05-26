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
  category?: CategoryData
  categories?: CategoryData[]
  comments?: CommentData[]
  tokens?: TokenData
}

interface CategoryData {
  _id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

interface CommentData {
  _id: string
  content: string
  authorId: string
  authorPseudo: string
  resourceId: string
  createdAt: string
  updatedAt: string
}
