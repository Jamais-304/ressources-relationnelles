import mongoose, { Document, Schema } from "mongoose"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"
import { commentMsgRequierd, commentsIdMaxLength, content, author, resource } from "../handlerResponse/errorHandler/configs.ts"


interface ICommentsSchema extends CommentsInterface, Document {}

const commentsSchema: Schema<ICommentsSchema> = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, commentMsgRequierd(content)],
            trim: true
        },
        authorId: {
            type: String,
            required: [true, commentMsgRequierd(`${author} ID`)],
            trim: true,
            maxlength: [35, commentsIdMaxLength(`${author} ID`, 35)]
        },
        resourceId: {
            type: String,
            required: [true, commentMsgRequierd(`${resource} ID`)],
            trim: true,
            maxlength: [35, commentsIdMaxLength(`${resource} ID`, 35)]
        }
    },
    {
        timestamps: true
    }
)

const Comments = mongoose.model<ICommentsSchema>("Comments", commentsSchema)

export default Comments
