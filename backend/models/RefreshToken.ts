import mongoose, { Document, Schema } from "mongoose"

interface IRefreshToken extends Document {
    refreshToken: string
    userId: mongoose.Schema.Types.ObjectId
    createdAt: Date
}

const refreshTokenSchema: Schema<IRefreshToken> = new mongoose.Schema(
    {
        refreshToken: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
            ref: String,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: '7d'
        }
    },
)

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema)

export default RefreshToken
