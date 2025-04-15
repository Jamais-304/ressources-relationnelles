
import type { Request, Response } from 'express';
import type { AuthRequest } from '../interfaces/authInterface.ts';

import Resource from '../models/Resource.ts';
import User from '../models/User.ts';

import { resourceNotFound, resourceParameterNotFound, unauthorized, unexpectedError } from '../handlerResponse/errorHandler/configs.ts';
import { errorHandler } from '../handlerResponse/errorHandler/errorHandler.ts';

import { getResources, createResource as createResourceSuccess, updateResource as updateResourceSuccess, deleteResource as deleteResourceSuccess } from '../handlerResponse/succesHandler/configs.ts';
import { succesHandler } from '../handlerResponse/succesHandler/succesHandler.ts';



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
		const user = await User.findById(req.auth.userId)

		// check if user exists
		if (!user) {
			errorHandler(res, unauthorized) //connection error ?
			return
		}

		// check if resource information is provided
		/**
	authorId: string;
	title: string;
	contentGridfsId: string;
	category: 'TEXT' | 'HTML' | 'VIDEO' | 'AUDIO' | 'IMAGE';
	relationType: string;
	status?: 'DRAFT' | 'PENDING' | 'PUBLISHED';
	validatedAndPublishedAt?: Date;
	validatedBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
		 */
		if (!req.body.title || !req.body.category || !req.body.relationType) {
			errorHandler(res, resourceParameterNotFound) //missing resource information
			return
		}

		// TODO : double check the content input so that invalid content is not uploaded to gridFS
		if (req.body.category !== 'TEXT' && req.body.category !== 'HTML' && req.body.category !== 'VIDEO' && req.body.category !== 'AUDIO' && req.body.category !== 'IMAGE') {
			errorHandler(res, resourceParameterNotFound) //unvalid resource category
			return
		}

		// TODO: try to insert content into gridFS here
		// check if that worked before creating the resource

		const resource = new Resource({
			...req.body,
			authorId: req.auth.userId,
			status: 'DRAFT',
			contentGridfsId: null, //TODO: handle gridFS content upload
			validatedAndPublishedAt: null,
			validatedBy: null,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		await resource.save()
		succesHandler(res, createResourceSuccess, resource)
		return

	} catch (error) {
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

	//TODO: call a middleware to inform the user that the resource has been validated and published ?

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
		
		//TODO: add validatedBy and validatedAndPublishedAt fields to the resource
		const resource = await Resource.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })

		if (!resource) {
			errorHandler(res, unexpectedError) //failed to update the resource status
			return
		}

		succesHandler(res, updateResourceSuccess, resource)
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



