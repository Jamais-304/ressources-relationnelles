import mongoose, { Document, Schema } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
import { type UserInterface } from "../interfaces/userInterfaces.ts"
import {
    userMsgEmailInvalid,
    userMsgRequierd,
    userMsgMinLength,
    userMsgMaxLength,
    password,
    pseudonyme,
    email,
    role
} from "../handlerResponse/errorHandler/configs.ts"
import {ROLE_HIERARCHY} from "../configs.ts"
interface IUserSchema extends UserInterface, Document {}

const userSchema: Schema<IUserSchema> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, userMsgRequierd(email)],
            unique: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, userMsgEmailInvalid]
        },
        password: {
            type: String,
            required: [true, userMsgRequierd(password)],
            trim: true,
            minlength: [8, userMsgMinLength(password, 8)],
            maxlength: [90, userMsgMaxLength(password, 90)]
        },
        pseudonyme: {
            type: String,
            required: [true, userMsgRequierd(pseudonyme)],
            trim: true,
            minlength: [5, userMsgMinLength(pseudonyme, 5)],
            maxlength: [40, userMsgMaxLength(pseudonyme, 40)]
        },
        role: {
            type: String,
            required: [true, userMsgRequierd(role)],
            enum: {
                values: ROLE_HIERARCHY,
                message: 'Le role "{VALUE}" est invalide'
            },
            default: ROLE_HIERARCHY[3]
        }
    },
    {
        timestamps: true
    }
)

userSchema.plugin(uniqueValidator)

const User = mongoose.model<IUserSchema>("User", userSchema)

export default User
