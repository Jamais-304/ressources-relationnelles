import { Router } from "express"
import { createComments, getCommentsByResource, deleteComment, updateComment } from "../controllers/commentControllers.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { auth } from "../middleware/auth.ts"
import { commentsValidationRules } from "../middleware/validators/commentValidator.ts"

const router = Router()

// Créer un commentaire (authentifié)
router.post('/v1/comments/:Id', auth, commentsValidationRules, validationErrorHandler, createComments)

// Récupérer tous les commentaires d'une ressource (public)
router.get('/v1/comments/resource/:resourceId', getCommentsByResource)

// Mettre à jour un commentaire (authentifié, auteur seulement)
router.put('/v1/comments/:commentId', auth, commentsValidationRules, validationErrorHandler, updateComment)

// Supprimer un commentaire (authentifié, auteur ou admin)
router.delete('/v1/comments/:commentId', auth, deleteComment)

export default router 