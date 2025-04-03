import type { Request, Response } from "express"
import { dataResponse, errorResponse } from "../handlerResponse/formatResponse.ts"
import { errorHandler } from "../handlerResponse/errorHandler/errorHandler.ts"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"
import User from "../models/User.ts"
import { serverError } from "../handlerResponse/errorHandler/configs.ts"

export const createComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentObject: CommentsInterface = req.body

        const user = await User.findOne({ _id: commentObject.authorId })

        if (!user) {
            res.status(500).json(errorResponse({ msg: "Server error" }))
            return
        }
        // Ajouter un test pour vérifier si la ressource existe
        if (user._id === commentObject.authorId) {
            res.status(201).json(dataResponse("Comments created"))
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}
