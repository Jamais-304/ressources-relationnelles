import { Router } from "express"
import { getActiveRelationTypes, getAllRelationTypes, createRelationType, updateRelationType, deleteRelationType } from "../controllers/relationTypeController.ts"
import { auth } from "../middleware/auth.ts"

const router = Router()

// Route publique pour récupérer les types de relations actifs
router.get('/v1/relation-types/active', getActiveRelationTypes)

// Routes protégées (administrateur/super-admin uniquement)
router.get('/v1/relation-types/', auth, getAllRelationTypes)
router.post('/v1/relation-types/', auth, createRelationType)
router.put('/v1/relation-types/:id', auth, updateRelationType)
router.delete('/v1/relation-types/:id', auth, deleteRelationType)

export default router 