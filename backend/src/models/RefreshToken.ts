import mongoose, { Document, Schema } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
import {refreshTokenIsRequierd} from "../handlerResponse/errorHandler/configs.ts"
import {expireRefreshToken} from "../configs.ts"
interface IRefreshToken extends Document {
    refreshToken: string
    userId: mongoose.Schema.Types.ObjectId
    createdAt: Date
}

const refreshTokenSchema: Schema<IRefreshToken> = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: [true, refreshTokenIsRequierd],
        unique: true
    },
    userId: {
        type: String,
        required: true,
        ref: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: expireRefreshToken
    }
})

refreshTokenSchema.plugin(uniqueValidator)

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema)

export default RefreshToken
