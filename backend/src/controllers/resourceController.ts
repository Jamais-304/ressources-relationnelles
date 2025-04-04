// CRUD
// vérifier les rôles etc

import type { Request, Response } from 'express';
import Resource from '../models/Resource.ts';
import User from '../models/User.ts';
import { unexpectedError } from '../handlerResponse/errorHandler/configs.ts';
import { errorHandler } from '../handlerResponse/errorHandler/errorHandler.ts';


//TODO: remove this interface and use the one from the interfaces folder
interface AuthRequest extends Request {
    auth?: {
        userId: string
    }
}

export const getAllResources = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else {
		const user = await User.findById(req.auth.userId);

		// check if user is authorized: admin or super-admin
		if (!user || !user.role || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}
	}

	try {
		const resources = await Resource.find();
		res.status(200).json(resources);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

export const getAllPublishedResources = async (req: Request, res: Response) => {

	try {
		const resources = await Resource.find({ status: 'PUBLISHED' });
		res.status(200).json(resources);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

export const getResourceById = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else {
		const user = await User.findById(req.auth.userId);

		// check if user is authorized: admin, super-admin or Resource owner
		if (!user || !user.role || (user.role !== 'administrateur' && user.role !== 'super-administrateur') && user._id !== req.auth.userId) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}
	}

	try {
		const resource = await Resource.findById(req.params.id);
		res.status(200).json(resource);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

export const createResource = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	}

	try {
		const resource = new Resource(req.body);
		await resource.save();
		res.status(201).json(resource);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

export const updateResource = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		res.status(401).json({ message: 'Unauthorized' });
		return;

	} else {
		const user = await User.findById(req.auth.userId);
		const resource = await Resource.findById(req.params.id);

		// check if user is authorized: resource owner
		if (!user || !user.role || !resource || user._id.toString() !== resource.authorId.toString()) {
			//TODO: fix the above line
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}
	}

	try {
		const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
		res.status(200).json(resource);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

export const updateResourceStatus = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else {
		const user = await User.findById(req.auth.userId);

		// check if user is authorized: moderator, admin or super-admin
		if (!user || !user.role || (user.role !== 'moderateur' && user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}
	}

	try {
		const resource = await Resource.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
		res.status(200).json(resource);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

export const deleteResource = async (req: AuthRequest, res: Response) => {

	// user auth handling
	if (!req.auth || !req.auth.userId) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else {
		const user = await User.findById(req.auth.userId);

		// check if user is authorized: admin, super-admin or resource owner
		if (!user || !user.role || (user.role !== 'administrateur' && user.role !== 'super-administrateur' && user._id !== req.auth.userId)) {
			res.status(401).json({ message: 'Unauthorized' });
			return;
		}
	}

	try {
		await Resource.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: `Resource with id ${req.params.id} deleted successfully` });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError
		errorHandler(res, errorMessage)
		return
	}
}

