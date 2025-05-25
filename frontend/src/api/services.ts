import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export interface Category {
  _id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface RelationType {
  _id: string
  name: string
  displayName: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Service pour récupérer les catégories publiques
export const getPublicCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/categories/public`)
    return response.data.data || []
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }
}

// Service pour récupérer les types de relations actifs
export const getActiveRelationTypes = async (): Promise<RelationType[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/relation-types/active`)
    return response.data.data || []
  } catch (error) {
    console.error('Erreur lors de la récupération des types de relations:', error)
    return []
  }
} 