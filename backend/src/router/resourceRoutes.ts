import { Router } from "express"
import { getAllResources, getResourceById, createResource, createTextResource, updateResource, updateResourceStatus, deleteResource, getAllPublishedResources, uploadImage, getImage, getResourceContent, getPublishedResourceContent } from "../controllers/resourceController.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { auth } from "../middleware/auth.ts"

import { upload } from "../middleware/fileUpload.ts"

const router = Router()

router.get('/v1/resource/', auth, getAllResources)

router.get('/v1/resource/published', getAllPublishedResources)

// Route publique pour accéder à une ressource publiée spécifique
router.get('/v1/resource/published/:id', getResourceById)

// Route publique pour accéder au contenu d'une ressource publiée
router.get('/v1/resource/published/:id/content', getPublishedResourceContent)

router.get('/v1/resource/:id', auth, getResourceById)

// Upload d'image pour l'éditeur WYSIWYG
router.post('/v1/resource/upload-image', auth, upload.single('image'), uploadImage)

// Servir les images depuis GridFS
router.get('/v1/resource/image/:id', getImage)

// Servir le contenu des ressources depuis GridFS (pour modération)
router.get('/v1/resource/content/:id', auth, getResourceContent)

// Création de ressource texte/HTML (WYSIWYG)
router.post('/v1/resource/create-text', auth, createTextResource)

// Création de ressource fichier (GRIDFS)
router.post('/v1/resource/create', auth, (req, res, next) => {
	console.log('🔍 DEBUG - Route /v1/resource/create hit')
	console.log('🔍 DEBUG - Request headers:', req.headers)
	console.log('🔍 DEBUG - Request content-type:', req.get('content-type'))
	console.log('🔍 DEBUG - Request body before multer:', req.body)
	console.log('🔍 DEBUG - Request file before multer:', req.file)
	next()
}, upload.single('file'), (req, res, next) => {
	console.log('🔍 DEBUG - After multer middleware')
	console.log('🔍 DEBUG - Request body after multer:', req.body)
	console.log('🔍 DEBUG - Request file after multer:', req.file)
	next()
}, createResource)

router.put('/v1/resource/:id', auth, updateResource)

router.put('/v1/resource/:id/status', auth, updateResourceStatus)

router.delete('/v1/resource/:id', auth, deleteResource)

export default router
