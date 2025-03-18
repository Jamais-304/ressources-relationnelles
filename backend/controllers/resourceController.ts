// CRUD
// vérifier les rôles etc

import { Request, Response } from 'express';
import Resource from '../models/Resource';

export const getAllResources = async (req: Request, res: Response) => {
	try {
		const resources = await Resource.find();
		res.status(200).json(resources);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
}

export const getResourceById = async (req: Request, res: Response) => {

}

export const createResource = async (req: Request, res: Response) => {

}

export const updateResource = async (req: Request, res: Response) => {

}

export const updateResourceStatus = async (req: Request, res: Response) => {

}

export const deleteResource = async (req: Request, res: Response) => {

}

