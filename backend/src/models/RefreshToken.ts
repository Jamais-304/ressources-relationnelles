import mongoose, { Document, Schema } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

interface IRefreshToken extends Document {
    refreshToken: string
    userId: mongoose.Schema.Types.ObjectId
    createdAt: Date
}

const refreshTokenSchema: Schema<IRefreshToken> = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: [true, "The refresh token is necessary"],
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
        expires: "7d"
    }
})

refreshTokenSchema.plugin(uniqueValidator)

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema)

export default RefreshToken
