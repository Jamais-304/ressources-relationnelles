import { computed } from 'vue'

export interface Resource {
  uuid: string
  title: string
  authorUuid: string
  contentGridfsUuid: string
  category: string
  status: string
  validatedAndPublishedAt?: string | undefined
  validatedBy?: number | undefined
  createdAt: string
  updatedAt: string
}

export const useResourceHelpers = () => {
  // Fonctions pour les statuts
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'success'
      case 'PENDING': return 'warning'
      case 'DRAFT': return 'info'
      default: return 'grey'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'mdi-check-circle'
      case 'PENDING': return 'mdi-clock-outline'
      case 'DRAFT': return 'mdi-file-edit'
      default: return 'mdi-help-circle'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Publié'
      case 'PENDING': return 'En attente'
      case 'DRAFT': return 'Brouillon'
      default: return status
    }
  }

  // Fonctions pour les catégories
  const getCategoryDisplayName = (categoryName: string) => {
    const categoryNames: Record<string, string> = {
      'TEXT': 'Texte',
      'IMAGE': 'Image',
      'VIDEO': 'Vidéo',
      'AUDIO': 'Audio',
      'sante_mentale': 'Santé mentale',
      'sorties': 'Sorties',
      'bien_etre': 'Bien-être',
      'support_communautaire': 'Support communautaire',
      'ressources_professionnelles': 'Ressources professionnelles',
      'formation': 'Formation',
      'logement': 'Logement',
      'famille_parentalite': 'Famille & Parentalité'
    }
    return categoryNames[categoryName] || categoryName
  }

  const getResourceIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'text': return 'mdi-text-box'
      case 'image': return 'mdi-image'
      case 'video': return 'mdi-video'
      case 'audio': return 'mdi-music'
      case 'sante_mentale': return 'mdi-heart-pulse'
      case 'sorties': return 'mdi-calendar-star'
      case 'bien_etre': return 'mdi-spa'
      case 'support_communautaire': return 'mdi-account-group'
      case 'ressources_professionnelles': return 'mdi-briefcase'
      case 'formation': return 'mdi-school'
      case 'logement': return 'mdi-home'
      case 'famille_parentalite': return 'mdi-baby-face'
      default: return 'mdi-file'
    }
  }

  const getResourceColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'text': return 'blue'
      case 'image': return 'green'
      case 'video': return 'red'
      case 'audio': return 'purple'
      case 'sante_mentale': return 'pink'
      case 'sorties': return 'orange'
      case 'bien_etre': return 'teal'
      case 'support_communautaire': return 'indigo'
      case 'ressources_professionnelles': return 'brown'
      case 'formation': return 'cyan'
      case 'logement': return 'amber'
      case 'famille_parentalite': return 'deep-purple'
      default: return 'grey'
    }
  }

  // Fonction de formatage de date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return {
    getStatusColor,
    getStatusIcon,
    getStatusText,
    getCategoryDisplayName,
    getResourceIcon,
    getResourceColor,
    formatDate
  }
} 