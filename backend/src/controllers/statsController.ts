import type { Request, Response } from 'express';
import User from '../models/User.ts';
import Resource from '../models/Resource.ts';
import { errorHandler } from '../handlerResponse/errorHandler/errorHandler.ts';
import { succesHandler } from '../handlerResponse/succesHandler/succesHandler.ts';
import { unexpectedError } from '../handlerResponse/errorHandler/configs.ts';

/**
 * The function retrieves various statistics from the database, including the number of users,
 * and the number of resources by status (published, draft, pending).
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object to send to the client
 * @returns {Promise<void>} a promise that resolves when the statistics are retrieved
 */
export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Count the total number of users
        const userCount = await User.countDocuments();

        // Count the number of resources by status
        const publishedResourcesCount = await Resource.countDocuments({ status: 'PUBLISHED' });
        const draftResourcesCount = await Resource.countDocuments({ status: 'DRAFT' });
        const pendingResourcesCount = await Resource.countDocuments({ status: 'PENDING' });

        const totalResourcesCount = await Resource.countDocuments();
        const categoriesCount = await Resource.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        const stats = {
            userCount,
            totalResourcesCount,
            publishedResourcesCount,
            draftResourcesCount,
            pendingResourcesCount,
            categoriesCount
        };

        // Send the stats as a successful response
        succesHandler(res, 'Statistics retrieved successfully', stats);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : unexpectedError;
        errorHandler(res, errorMessage);
    }
};