import type { Request, Response } from "express"
import User from "../models/User.ts"
import Comment from "../models/Comment.ts"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"
import { errorHandler } from "../handlerResponse/errorHandler/errorHandler.ts"
import { succesHandler } from "../handlerResponse/succesHandler/succesHandler.ts"
import { serverError } from "../handlerResponse/errorHandler/configs.ts"
import { commentCreated } from "../handlerResponse/succesHandler/configs.ts"

export const createComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentObject: CommentsInterface = req.body
        // Create a new user instance with the hashed password
        const newComment = new Comment({
            content: commentObject.content,
            authorId: commentObject.authorId,
            resourceId: commentObject.resourceId
        })
        const user = await User.findOne({ _id: req.params.Id })

        if (!user) {
            errorHandler(res, serverError)
            return
        }

        if (user._id === req.params.Id) {
            const savedComment = await newComment.save()
            succesHandler(res, commentCreated, {comments : savedComment})
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}
