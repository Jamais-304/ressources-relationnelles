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
    console.log('🔍 DEBUG - Categories response:', response.data)
    
    // Essayer différents formats de réponse
    let categories = null
    
    // Format nouveau: { data: { categories: [...] } }
    if (response.data.data?.categories) {
      categories = response.data.data.categories
    }
    // Format nouveau: { data: { category: [...] } } (au cas où)
    else if (response.data.data?.category) {
      categories = Array.isArray(response.data.data.category) ? response.data.data.category : [response.data.data.category]
    }
    // Format ancien: { data: [...] }
    else if (response.data.data && Array.isArray(response.data.data)) {
      categories = response.data.data
    }
    // Format direct: { categories: [...] }
    else if (response.data.categories) {
      categories = response.data.categories
    }
    // Format direct: [...] 
    else if (Array.isArray(response.data)) {
      categories = response.data
    }
    
    console.log('🔍 DEBUG - Parsed categories:', categories)
    return categories || []
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