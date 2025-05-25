import type { Request, Response } from 'express';
import type { AuthRequest } from '../interfaces/authInterface.ts';

import Resource from '../models/Resource.ts';
import User from '../models/User.ts';

import { resourceNotFound, resourceParameterNotFound, unauthorized, unexpectedError } from '../handlerResponse/errorHandler/configs.ts';
import { errorHandler } from '../handlerResponse/errorHandler/errorHandler.ts';

import { getResources, createResource as createResourceSuccess, updateResource as updateResourceSuccess, deleteResource as deleteResourceSuccess } from '../handlerResponse/succesHandler/configs.ts';
import { succesHandler } from '../handlerResponse/succesHandler/succesHandler.ts';
import { uploadToGridFS, categorySizeLimit, allowedMimeTypes } from '../utils/gridfsHandler.ts';
import { getStreamFileFromGridFS } from '../utils/gridfsHandler.ts';



/**
 * The function retrieves all resources from the database and sends them as a JSON response.
 * The user must be an admin or super-admin as unpublished resources are not accessible to all users.
 * 
 * @param {AuthRequest} req the request object containing the authenticated user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resources are retrieved
 */
export const getAllResources = async (req: AuthRequest, res: Response): Promise<void> => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	} else {
		const user = await User.findById(req.auth.userId);

		// check if user is authorized: admin or super-admin
		if (!user || !user.role || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
			errorHandler(res, unauthorized)
			return
		}
	}

	try {
		const resources = await Resource.find();
		succesHandler(res, getResources, resources)
		return
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * The function retrieves all published resources from the database and sends them as a JSON response.
 * The user does not have to be connected.
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resources are retrieved
 */
export const getAllPublishedResources = async (req: Request, res: Response): Promise<void> => {

	try {
		const resources = await Resource.find({ status: 'PUBLISHED' })
		succesHandler(res, getResources, resources)
		return
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * The function retrieves a resource by its ID from the database and sends it as a JSON response.
 * The user must be an admin, super-admin or the resource owner if the resource is not published.
 * 
 * @param {AuthRequest} req the request object containing the resource ID and optional user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resource is retrieved
 */
export const getResourceById = async (req: AuthRequest, res: Response): Promise<void> => {
	
	// checking if params.id is contained in the request body
	if (!req.params.id) {
		errorHandler(res, resourceParameterNotFound)
		return
	}

	try {
		// resource handling
		const resource = await Resource.findById(req.params.id)

		if (!resource) {
			errorHandler(res, resourceNotFound)
			return
		}

		// handle resource status
		if (resource.status === 'PUBLISHED') {
			succesHandler(res, getResources, resource)
			return
		}

		// resource is not published, check user authorization
		if (!req.auth || !req.auth.userId) {
			errorHandler(res, unauthorized)
			return
		}

		const user = await User.findById(req.auth.userId)

		// check if user is authorized: admin, super-admin or resource owner
		if (!user || !user.role || (user.role !== 'administrateur' && user.role !== 'super-administrateur' && user._id.toString() !== resource.authorId.toString())) {
			errorHandler(res, unauthorized)
			return
		}

		// all tests passed, send the resource
		succesHandler(res, getResources, resource)
		return

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}


/**
 * The function creates a new resource in the database and sends it as a JSON response.
 * The user must be authenticated.
 * 
 * The controller ignores unnecessary fields and sets their default values.
 * Only the title, category, and relationType are required.
 * 
 * The controller also handles the creation of the resource in GridFS.
 * 
 * @param {AuthRequest} req the request object containing resource and user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resource is created
 */
export const createResource = async (req: AuthRequest, res: Response) => {

	//TODO : handle gridFS content upload

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	}

	try {
		console.log('🔍 DEBUG - createResource called with body:', req.body)
		console.log('🔍 DEBUG - createResource called with file:', req.file ? {
			originalname: req.file.originalname,
			mimetype: req.file.mimetype,
			size: req.file.size
		} : 'No file')

		const user = await User.findById(req.auth.userId)

		// check if user exists
		if (!user) {
			console.log('❌ DEBUG - User not found')
			errorHandler(res, unauthorized) //connection error ?
			return
		}

		// check if resource information is provided
		if (!req.body.title || !req.body.category || !req.body.relationType) {
			console.log('❌ DEBUG - Missing required fields:', {
				title: !!req.body.title,
				category: !!req.body.category,
				relationType: !!req.body.relationType
			})
			errorHandler(res, resourceParameterNotFound) //missing resource information
			return
		}

		// Valider que la catégorie est fournie (on accepte maintenant toutes les catégories métier)
		if (!req.body.category.trim()) {
			console.log('❌ DEBUG - Empty category')
			errorHandler(res, 'Catégorie requise')
			return
		}
		
		//----------------------------------------------------
		if (!req.file) {
			console.log('❌ DEBUG - No file provided')
			errorHandler(res, resourceParameterNotFound) // pas de fichier envoyé
			return
		}
		
		// Déterminer automatiquement le type de fichier basé sur le MIME type
		const { buffer, originalname, mimetype } = req.file
		let fileType: string
		
		console.log('🔍 DEBUG - Processing file:', { originalname, mimetype, size: req.file.size })
		
		if (mimetype.startsWith('image/')) {
			fileType = 'IMAGE'
		} else if (mimetype.startsWith('video/')) {
			fileType = 'VIDEO'
		} else if (mimetype.startsWith('audio/')) {
			fileType = 'AUDIO'
		} else if (mimetype.startsWith('text/')) {
			fileType = 'TEXT'
		} else {
			console.log('❌ DEBUG - Unsupported file type:', mimetype)
			errorHandler(res, `Type de fichier non supporté: ${mimetype}`)
			return
		}
		
		console.log('🔍 DEBUG - Detected file type:', fileType)
		
		// Vérifier que le MIME type est autorisé pour ce type de fichier
		if (!allowedMimeTypes[fileType].includes(mimetype)) {
			console.log('❌ DEBUG - MIME type not allowed:', { fileType, mimetype, allowed: allowedMimeTypes[fileType] })
			errorHandler(res, `Type de fichier non autorisé: ${mimetype}. Types autorisés pour ${fileType}: ${allowedMimeTypes[fileType].join(', ')}`)
			return
		}
		
		// Vérifier la taille du fichier
		if (req.file.size > categorySizeLimit[fileType]) {
			console.log('❌ DEBUG - File too large:', { size: req.file.size, limit: categorySizeLimit[fileType] })
			errorHandler(res, `Fichier trop volumineux : max autorisé pour ${fileType} = ${categorySizeLimit[fileType] / 1024 / 1024} Mo`)
			return
		}
		
		console.log('🔍 DEBUG - All validations passed, uploading to GridFS...')
		
		let contentGridfsUuidResult: string
		try {
			contentGridfsUuidResult = await uploadToGridFS(buffer, originalname, mimetype)
			console.log('✅ DEBUG - GridFS upload successful:', contentGridfsUuidResult)
		} catch (err) {
			console.log('❌ DEBUG - GridFS upload failed:', err)
			errorHandler(res, `Erreur lors du téléversement du contenu à GridFS`)
			return
		}

		console.log('🔍 DEBUG - Creating resource with data:', {
			authorId: req.auth.userId,
			title: req.body.title,
			contentGridfsId: contentGridfsUuidResult,
			resourceMIMEType: mimetype,
			category: req.body.category,
			relationType: req.body.relationType
		})

		const resource = new Resource({
			authorId: req.auth.userId,
			title: req.body.title,
			contentGridfsId: contentGridfsUuidResult,
			resourceMIMEType: mimetype,
			category: req.body.category,
			relationType: req.body.relationType,
			status: 'PENDING',
			validatedAndPublishedAt: null,
			validatedBy: null,
		})

		await resource.save()
		console.log('✅ DEBUG - Resource saved successfully')
		succesHandler(res, createResourceSuccess, resource)
		return

	} catch (error) {
		console.log('❌ DEBUG - Unexpected error:', error)
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}

}

/**
 * The function updates an existing resource in the database and sends it as a JSON response.
 * The user must be authenticated and be the resource owner.
 * 
 * The controller ignores unnecessary fields and sets their default values.
 * When a resource is updated, its status is set back to 'DRAFT'
 * and the validatedAndPublishedAt and validatedBy fields are set to null.
 * 
 * If applicable, it also updates the content in GridFS.
 * 
 * @param {AuthRequest} req the request object containing resource and user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resource is updated
 */
export const updateResource = async (req: AuthRequest, res: Response) => {

	//TODO : handle gridFS content upload/update, and check if that worked before updating the resource

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	}

	try {
	
		const user = await User.findById(req.auth.userId)
		const resource = await Resource.findById(req.params.id)

		// check if user is authorized: resource owner
		if (!user || !user.role || !resource || user._id.toString() !== resource.authorId.toString()) {
			//TODO: check if the above line works
			errorHandler(res, unauthorized)
			return
		}

		// TODO: here handle gridFS content upload/update, and check if that worked before updating the resource

		const newResource = await Resource.findByIdAndUpdate(
			req.params.id,
			// update the resource with the new information, ignoring unnecessary fields
			// need to check if the all the fields are listed here
			{
				...req.body, //is it overridden correctly by next lines?
				status: 'DRAFT',
				contentGridfsId: null, //TODO: handle gridFS content upload/update
				validatedAndPublishedAt: null,
				validatedBy: null,
				updatedAt: new Date()
			},
			{ new: true }
		)

		if (!newResource) {
			errorHandler(res, unexpectedError) //failed to update the resource
			return
		}

		succesHandler(res, updateResourceSuccess, newResource)
		return

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}


/**
 * The function updates the status of a resource in the database and sends it as a JSON response.
 * The user must be authenticated and be a moderator, an administrator or a super-administrator.
 * 
 * @param {AuthRequest} req the request object containing resource and user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resource is updated
 */
export const updateResourceStatus = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	}

	try {

		const user = await User.findById(req.auth.userId)

		// check if user is authorized: moderator, admin or super-admin
		if (!user || !user.role || (user.role !== 'moderateur' && user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
			errorHandler(res, unauthorized)
			return
		}

		// Validate the status value
		const { status } = req.body
		if (!status || !['DRAFT', 'PENDING', 'PUBLISHED'].includes(status)) {
			errorHandler(res, 'Statut invalide. Valeurs acceptées: DRAFT, PENDING, PUBLISHED')
			return
		}

		// Prepare update data
		const updateData: any = { status }

		// If status is PUBLISHED, set validation fields
		if (status === 'PUBLISHED') {
			updateData.validatedBy = req.auth.userId
			updateData.validatedAndPublishedAt = new Date()
		} else if (status === 'DRAFT' || status === 'PENDING') {
			// Reset validation fields if changing back to draft or pending
			updateData.validatedBy = null
			updateData.validatedAndPublishedAt = null
		}

		const resource = await Resource.findByIdAndUpdate(
			req.params.id, 
			updateData, 
			{ new: true }
		)

		if (!resource) {
			errorHandler(res, resourceNotFound)
			return
		}

		succesHandler(res, updateResourceSuccess, resource as any)
		return

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * The function deletes a resource in the database.
 * The user must be the owner of the resource, an administrator or a super-administrator.
 * 
 * @param {AuthRequest} req the request object containing resource and user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resource is updated
 */
export const deleteResource = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return

	}
	
	try {

		if (!req.params.id) {
			errorHandler(res, resourceParameterNotFound)
			return
		}

		const user = await User.findById(req.auth.userId)

		// check if user is authorized: admin, super-admin or resource owner
		if (!user || !user.role || (user.role !== 'administrateur' && user.role !== 'super-administrateur' && user._id !== req.auth.userId)) {
			errorHandler(res, unauthorized)
			return
		}
	
		await Resource.findByIdAndDelete(req.params.id);

		succesHandler(res, deleteResourceSuccess)
		return

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * Upload an image for the WYSIWYG editor
 * The user must be authenticated.
 * 
 * @param {AuthRequest} req the request object containing the image file and user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the image is uploaded
 */
export const uploadImage = async (req: AuthRequest, res: Response): Promise<void> => {
	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	}

	try {
		const user = await User.findById(req.auth.userId)

		// check if user exists
		if (!user) {
			errorHandler(res, unauthorized)
			return
		}

		// check if image file is provided
		if (!req.file) {
			errorHandler(res, 'Aucun fichier image fourni')
			return
		}

		// validate file type (only images)
		if (!req.file.mimetype.startsWith('image/')) {
			errorHandler(res, 'Le fichier doit être une image')
			return
		}

		// check file size (max 5MB for images in editor)
		const maxSize = 5 * 1024 * 1024 // 5MB
		if (req.file.size > maxSize) {
			errorHandler(res, 'L\'image ne peut pas dépasser 5 MB')
			return
		}

		const { buffer, originalname, mimetype } = req.file

		let imageGridfsUuid: string
		try {
			imageGridfsUuid = await uploadToGridFS(buffer, originalname, mimetype)
		} catch (err) {
			errorHandler(res, 'Erreur lors du téléversement de l\'image')
			return
		}

		// Return the image URL/ID for the editor
		const imageUrl = `/api/v1/resource/image/${imageGridfsUuid}`
		
		succesHandler(res, 'Image téléversée avec succès', { imageUrl, imageUuid: imageGridfsUuid } as any)
		return

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * Serve an image from GridFS
 * Public endpoint - no authentication required
 * 
 * @param {Request} req the request object containing the image ID
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the image is served
 */
export const getImage = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.params.id) {
			errorHandler(res, 'ID de l\'image manquant')
			return
		}

		const { stream, metadata } = await getStreamFileFromGridFS(req.params.id)
		
		// Set appropriate headers
		res.set({
			'Content-Type': metadata.contentType || 'image/jpeg',
			'Content-Length': metadata.length,
			'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
		})

		// Pipe the stream to response
		stream.pipe(res)

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Image non trouvée'
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * Creates a new text/HTML resource in the database.
 * The user must be authenticated.
 * This function handles text content (including HTML from WYSIWYG editor).
 * 
 * @param {AuthRequest} req the request object containing resource and user information
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the resource is created
 */
export const createTextResource = async (req: AuthRequest, res: Response): Promise<void> => {
	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	}

	try {
		const user = await User.findById(req.auth.userId)

		// check if user exists
		if (!user) {
			errorHandler(res, unauthorized)
			return
		}

		// check if resource information is provided
		if (!req.body.title || !req.body.category || !req.body.relationType || !req.body.content) {
			errorHandler(res, resourceParameterNotFound)
			return
		}

		const { title, category, relationType, content } = req.body
		
		// Determine MIME type based on content
		const resourceMIMEType = content.includes('<') ? 'text/html' : 'text/plain'
		
		// Upload content to GridFS
		const contentBuffer = Buffer.from(content, 'utf8')
		const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${resourceMIMEType === 'text/html' ? 'html' : 'txt'}`
		
		let contentGridfsUuid: string
		try {
			contentGridfsUuid = await uploadToGridFS(contentBuffer, filename, resourceMIMEType)
		} catch (err) {
			errorHandler(res, 'Erreur lors du téléversement du contenu')
			return
		}

		const resource = new Resource({
			authorId: req.auth.userId,
			title,
			contentGridfsId: contentGridfsUuid,
			resourceMIMEType,
			category,
			relationType,
			status: 'DRAFT',
			validatedAndPublishedAt: null,
			validatedBy: null,
		})

		await resource.save()
		succesHandler(res, createResourceSuccess, resource as any)
		return

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * Serve resource content from GridFS
 * Requires authentication for access control
 * 
 * @param {AuthRequest} req the request object containing the resource content ID
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the content is served
 */
export const getResourceContent = async (req: AuthRequest, res: Response): Promise<void> => {
	// user auth handling
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized)
		return
	}

	try {
		if (!req.params.id) {
			errorHandler(res, 'ID du contenu manquant')
			return
		}

		const user = await User.findById(req.auth.userId)

		// check if user is authorized: moderator, admin, super-admin
		if (!user || !user.role || (user.role !== 'moderateur' && user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
			errorHandler(res, unauthorized)
			return
		}

		const { stream, metadata } = await getStreamFileFromGridFS(req.params.id)
		
		// Set appropriate headers
		res.set({
			'Content-Type': metadata.contentType || 'application/octet-stream',
			'Content-Length': metadata.length,
			'Cache-Control': 'private, max-age=3600' // Cache for 1 hour
		})

		// Pipe the stream to response
		stream.pipe(res)

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Contenu non trouvé'
		errorHandler(res, errorMessage)
		return
	}
}

/**
 * Serve content of a published resource from GridFS
 * Public endpoint - no authentication required
 * Only works for published resources
 * 
 * @param {Request} req the request object containing the resource ID
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the content is served
 */
export const getPublishedResourceContent = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.params.id) {
			errorHandler(res, 'ID de la ressource manquant')
			return
		}

		// Find the resource and check if it's published
		const resource = await Resource.findById(req.params.id)

		if (!resource) {
			errorHandler(res, resourceNotFound)
			return
		}

		// Only allow access to published resources
		if (resource.status !== 'PUBLISHED') {
			errorHandler(res, 'Cette ressource n\'est pas publiée')
			return
		}

		// Get the content from GridFS using the contentGridfsId
		const { stream, metadata } = await getStreamFileFromGridFS(resource.contentGridfsId)
		
		// Set appropriate headers
		res.set({
			'Content-Type': metadata.contentType || 'application/octet-stream',
			'Content-Length': metadata.length,
			'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
		})

		// Pipe the stream to response
		stream.pipe(res)

	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Contenu non trouvé'
		errorHandler(res, errorMessage)
		return
	}
}



