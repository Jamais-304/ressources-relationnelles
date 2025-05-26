import type { Request, Response } from "express"
import User from "../models/User.ts"
import Comment from "../models/Comment.ts"
import Resource from "../models/Resource.ts"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"
import { errorHandler } from "../handlerResponse/errorHandler/errorHandler.ts"
import { succesHandler } from "../handlerResponse/succesHandler/succesHandler.ts"
import { serverError } from "../handlerResponse/errorHandler/configs.ts"
import { commentCreated, commentUpdated, commentDeleted, commentsFound } from "../handlerResponse/succesHandler/configs.ts"

export const createComments = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('🔍 DEBUG - createComments called')
        console.log('🔍 DEBUG - req.params.Id:', req.params.Id)
        console.log('🔍 DEBUG - req.body:', req.body)
        
        const commentObject: CommentsInterface = req.body
        const user = await User.findOne({ _id: req.params.Id })

        console.log('🔍 DEBUG - user found:', user)

        if (!user) {
            console.log('❌ DEBUG - User not found')
            errorHandler(res, "Utilisateur non trouvé")
            return
        }

        // Convertir les IDs en string pour la comparaison
        if (user._id.toString() === req.params.Id) {
            console.log('✅ DEBUG - User ID matches, creating comment')
            
            // Create a new comment instance
            const newComment = new Comment({
                content: commentObject.content,
                authorId: commentObject.authorId,
                resourceId: commentObject.resourceId
            })
            
            const savedComment = await newComment.save()
            console.log('✅ DEBUG - Comment saved:', savedComment)
            
            succesHandler(res, commentCreated, {comments : savedComment})
        } else {
            console.log('❌ DEBUG - User ID does not match')
            errorHandler(res, "Non autorisé à créer ce commentaire")
        }
    } catch (error: unknown) {
        console.error('❌ DEBUG - Error in createComments:', error)
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}

export const getCommentsByResource = async (req: Request, res: Response): Promise<void> => {
    try {
        const { resourceId } = req.params
        
        // Vérifier que la ressource existe
        const resource = await Resource.findById(resourceId)
        if (!resource) {
            errorHandler(res, "Ressource non trouvée")
            return
        }

        // Récupérer tous les commentaires de cette ressource avec les informations de l'auteur
        const comments = await Comment.find({ resourceId }).sort({ createdAt: -1 })
        
        // Enrichir les commentaires avec les informations de l'auteur
        const enrichedComments = await Promise.all(
            comments.map(async (comment) => {
                const author = await User.findById(comment.authorId).select('pseudonyme')
                return {
                    _id: comment._id,
                    content: comment.content,
                    authorId: comment.authorId,
                    authorPseudo: author?.pseudonyme || 'Utilisateur supprimé',
                    resourceId: comment.resourceId,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt
                }
            })
        )
        
        succesHandler(res, commentsFound, { comments: enrichedComments as any })
    } catch (error: unknown) {
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
    }
}

export const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params
        const { content } = req.body
        const userId = req.headers.userid as string

        // Trouver le commentaire
        const comment = await Comment.findById(commentId)
        if (!comment) {
            errorHandler(res, "Commentaire non trouvé")
            return
        }

        // Vérifier que l'utilisateur est l'auteur du commentaire
        if (comment.authorId !== userId) {
            errorHandler(res, "Non autorisé à modifier ce commentaire")
            return
        }

        // Mettre à jour le commentaire
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        )

        succesHandler(res, commentUpdated, { comments: updatedComment as any })
    } catch (error: unknown) {
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
    }
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId } = req.params
        const userId = req.headers.userid as string

        // Trouver le commentaire
        const comment = await Comment.findById(commentId)
        if (!comment) {
            errorHandler(res, "Commentaire non trouvé")
            return
        }

        // Récupérer l'utilisateur pour vérifier son rôle
        const user = await User.findById(userId)
        if (!user) {
            errorHandler(res, "Utilisateur non trouvé")
            return
        }

        // Vérifier que l'utilisateur est l'auteur du commentaire ou un admin
        const isAuthor = comment.authorId === userId
        const isAdmin = user.role === "administrateur" || user.role === "super-administrateur"
        
        if (!isAuthor && !isAdmin) {
            errorHandler(res, "Non autorisé à supprimer ce commentaire")
            return
        }

        // Supprimer le commentaire
        await Comment.findByIdAndDelete(commentId)

        succesHandler(res, commentDeleted, {})
    } catch (error: unknown) {
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
    }
}
