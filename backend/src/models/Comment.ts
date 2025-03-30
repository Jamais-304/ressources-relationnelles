import mongoose, { Document, Schema } from "mongoose"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"

interface ICommentsSchema extends CommentsInterface, Document {}

const commentsSchema: Schema<ICommentsSchema> = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Content cannot be empty"],
            trim: true
        },
        authorId: {
            type: String,
            required: [true, "Author ID is required"],
            trim: true,
            maxlength: [35, "Author ID must not exceed 45 characters"]
        },
        resourceId: {
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
