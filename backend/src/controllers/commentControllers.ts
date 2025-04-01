import type { Request, Response } from "express"
import { dataResponse, errorResponse } from "../utils/formatResponse.ts"
import { errorHandler } from "../utils/errorHandler.ts"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"
import User from "../models/User.ts"


export const createComments = async (req: Request, res: Response): Promise<void> => {
    try {

        const commentObject: CommentsInterface = req.body

        const user = await User.findOne({ _id: commentObject.authorId })

        if (!user) {
            res.status(500).json(errorResponse({ msg: "Server error" }))
            return
        }
        // Ajouter un test pour vérifier si la ressource existe
        if (user._id === commentObject.authorId){
            res.status(201).json(
            dataResponse("Comments created")
        )}
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
        return
    }
}
