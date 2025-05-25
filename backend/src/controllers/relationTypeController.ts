import type { Request, Response } from 'express';
import type { AuthRequest } from '../interfaces/authInterface.ts';
import RelationType from '../models/RelationType.ts';
import User from '../models/User.ts';
import { unauthorized, unexpectedError } from '../handlerResponse/errorHandler/configs.ts';
import { errorHandler } from '../handlerResponse/errorHandler/errorHandler.ts';
import { succesHandler } from '../handlerResponse/succesHandler/succesHandler.ts';

/**
 * Retrieves all active relation types from the database.
 * Public endpoint - no authentication required.
 */
export const getActiveRelationTypes = async (req: Request, res: Response): Promise<void> => {
	try {
		const relationTypes = await RelationType.find({ isActive: true }).sort({ displayName: 1 });
		succesHandler(res, 'Types de relations récupérés avec succès', relationTypes as any);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Retrieves all relation types from the database.
 * Only accessible by admin or super-admin users.
 */
export const getAllRelationTypes = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized);
		return;
	}

	const user = await User.findById(req.auth.userId);
	if (!user || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
		errorHandler(res, unauthorized);
		return;
	}

	try {
		const relationTypes = await RelationType.find().sort({ displayName: 1 });
		succesHandler(res, 'Types de relations récupérés avec succès', relationTypes as any);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Creates a new relation type.
 * Only accessible by admin or super-admin users.
 */
export const createRelationType = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized);
		return;
	}

	const user = await User.findById(req.auth.userId);
	if (!user || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
		errorHandler(res, unauthorized);
		return;
	}

	if (!req.body.name || !req.body.displayName) {
		errorHandler(res, 'Le nom et le nom d\'affichage sont requis');
		return;
	}

	try {
		const relationType = new RelationType({
			name: req.body.name,
			displayName: req.body.displayName,
			description: req.body.description || null,
			isActive: req.body.isActive !== undefined ? req.body.isActive : true,
		});

		await relationType.save();
		succesHandler(res, 'Type de relation créé avec succès', relationType as any);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Updates an existing relation type by its ID.
 * Only accessible by admin or super-admin users.
 */
export const updateRelationType = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized);
		return;
	}

	const user = await User.findById(req.auth.userId);
	if (!user || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
		errorHandler(res, unauthorized);
		return;
	}

	if (!req.params.id) {
		errorHandler(res, 'ID du type de relation manquant');
		return;
	}

	try {
		const updateData: any = { updatedAt: new Date() };
		
		if (req.body.name) updateData.name = req.body.name;
		if (req.body.displayName) updateData.displayName = req.body.displayName;
		if (req.body.description !== undefined) updateData.description = req.body.description;
		if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive;

		const updatedRelationType = await RelationType.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);

		if (!updatedRelationType) {
			errorHandler(res, 'Type de relation non trouvé');
			return;
		}

		succesHandler(res, 'Type de relation mis à jour avec succès', updatedRelationType as any);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Deletes a relation type by its ID.
 * Only accessible by admin or super-admin users.
 */
export const deleteRelationType = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized);
		return;
	}

	const user = await User.findById(req.auth.userId);
	if (!user || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
		errorHandler(res, unauthorized);
		return;
	}

	if (!req.params.id) {
		errorHandler(res, 'ID du type de relation manquant');
		return;
	}

	try {
		const deletedRelationType = await RelationType.findByIdAndDelete(req.params.id);
		if (!deletedRelationType) {
			errorHandler(res, 'Type de relation non trouvé');
			return;
		}

		succesHandler(res, 'Type de relation supprimé avec succès', undefined);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
}; 