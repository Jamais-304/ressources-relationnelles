import type { Request, Response } from 'express';
import type { AuthRequest } from '../interfaces/authInterface.ts';
import Category from '../models/Category.ts';
import User from '../models/User.ts';
import { /*categoryNotFound, categoryParameterNotFound,*/ categoryNotFound, categoryParameterNotFound, unauthorized, unexpectedError } from '../handlerResponse/errorHandler/configs.ts';
import { errorHandler } from '../handlerResponse/errorHandler/errorHandler.ts';

import { succesHandler } from '../handlerResponse/succesHandler/succesHandler.ts';
import { createCategorySuccess, deleteCategorySuccess, getCategories, updateCategorySuccess } from '../handlerResponse/succesHandler/configs.ts';

/**
 * Retrieves all categories from the database.
 * Only accessible by admin or super-admin users.
 */
export const getAllCategories = async (req: AuthRequest, res: Response): Promise<void> => {
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
		const categories = await Category.find();
		succesHandler(res, getCategories, categories);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Retrieves a category by its ID.
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
	if (!req.params.id) {
		errorHandler(res, categoryParameterNotFound);
		return;
	}

	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			errorHandler(res, categoryNotFound);
			return;
		}

		succesHandler(res, getCategories, category);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Creates a new category.
 * Only accessible by admin or super-admin users.
 */
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized);
		return;
	}

	const user = await User.findById(req.auth.userId);
	if (!user || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
		errorHandler(res, unauthorized);
		return;
	}

	if (!req.body.name) {
		errorHandler(res, categoryParameterNotFound);
		return;
	}

	try {
		const category = new Category({
			name: req.body.name,
			description: req.body.description || null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await category.save();
		succesHandler(res, createCategorySuccess, category);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Updates an existing category by its ID.
 * Only accessible by admin or super-admin users.
 */
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
	if (!req.auth || !req.auth.userId) {
		errorHandler(res, unauthorized);
		return;
	}

	const user = await User.findById(req.auth.userId);
	if (!user || (user.role !== 'administrateur' && user.role !== 'super-administrateur')) {
		errorHandler(res, unauthorized);
		return;
	}

	if (!req.params.id || !req.body.name) {
		errorHandler(res, categoryParameterNotFound);
		return;
	}

	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				description: req.body.description || null,
				updatedAt: new Date(),
			},
			{ new: true }
		);

		if (!updatedCategory) {
			errorHandler(res, categoryNotFound);
			return;
		}

		succesHandler(res, updateCategorySuccess, updatedCategory);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};

/**
 * Deletes a category by its ID.
 * Only accessible by admin or super-admin users.
 */
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
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
		errorHandler(res, categoryParameterNotFound);
		return;
	}

	try {
		const deletedCategory = await Category.findByIdAndDelete(req.params.id);
		if (!deletedCategory) {
			errorHandler(res, categoryNotFound);
			return;
		}

		succesHandler(res, deleteCategorySuccess);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : unexpectedError;
		errorHandler(res, errorMessage);
	}
};