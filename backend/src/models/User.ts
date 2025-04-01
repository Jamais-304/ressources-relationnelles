import mongoose, { Document, Schema } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
import { type UserInterface } from "../interfaces/userInterfaces.ts"

interface IUserSchema extends UserInterface, Document {}

const userSchema: Schema<IUserSchema> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email address"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            minlength: [8, "Password must be at least 8 characters long"],
            maxlength: [90, "Password must not exceed 90 characters"]
        },
        pseudonyme: {
            type: String,
            required: [true, "Pseudonym is required"],
            trim: true,
            minlength: [5, "Pseudonym must be at least 5 characters long"],
            maxlength: [40, "Pseudonym must not exceed 40 characters"]
        },
        role: {
            type: String,
            required: [true, "Role is required"],
            enum: {
                values: ["super-administrateur", "administrateur", "moderateur", "utilisateur"],
                message: 'The role "{VALUE}" is invalid.'
            },
            default: "utilisateur"
        }
    },
    {
        timestamps: true
    }
)

userSchema.plugin(uniqueValidator)

const User = mongoose.model<IUserSchema>("User", userSchema)

export default User
