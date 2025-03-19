import { Router } from "express"
import { getAllResources, getResourceById, createResource, updateResource, updateResourceStatus, deleteResource, getAllPublishedResources } from "../controllers/resourceController.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { auth } from "../middleware/auth.ts"

const router = Router()

router.get('/v1/resource/', auth, getAllResources)

router.get('/v1/resource/published', getAllPublishedResources)

router.get('/v1/resource/:id', auth, getResourceById)

router.post('/v1/resource/create', auth, createResource)

router.put('/v1/resource/:id', auth, updateResource)

router.put('/v1/resource/:id/status', auth, updateResourceStatus)

router.delete('/v1/resource/:id', auth, deleteResource)

export default router
