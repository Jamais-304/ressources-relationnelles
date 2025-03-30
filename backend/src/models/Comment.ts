import mongoose, { Document, Schema } from "mongoose"
import { type commentsInterface } from "../interfaces/commentsInterface.ts"

interface ICommentsSchema extends commentsInterface, Document {}

const commentsSchema: Schema<ICommentsSchema> = new mongoose.Schema(
    {
        contenu: {
            type: String,
            required: [true, "Content cannot be empty"],
            unique: true,
            trim: true
        },
        auteurId: {
            type: String,
            required: [true, "Author ID is required"],
            trim: true,
            maxlength: [35, "Author ID must not exceed 45 characters"]
        },
        ressourceId: {
            type: String,
            required: [true, "Resource ID is required"],
            trim: true,
            maxlength: [35, "Resource ID must not exceed 35 characters"]
        }
    },
    {
        timestamps: true
    }
)

const Comments = mongoose.model<ICommentsSchema>("Comments", commentsSchema)

export default Comments
