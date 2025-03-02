import mongoose, { Document, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

interface IUser extends Document {
    email: string;
    password: string;
    pseudonyme: string;
    role: 'super-administrateur' | 'administrateur' | 'moderateur' | 'utilisateur'
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            unique: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Adresse email invalide']
        },
        password: {
            type: String,
            required: [true, 'Le mot de passe est requis'],
            trim: true,
            minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
            maxlength: [55, 'Le mot de passe ne doit pas dépasser 55 caractères'],
            match: [
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"\'<>,.?/\\|`~-]).{6,55}$/,
                'Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial.'
            ]
        },
        pseudonyme: {
            type: String,
            required: [true, 'Le pseudonyme est requis'],
            trim: true,
            minlength: [5, 'Le pseudonyme doit contenir au moins 5 caractères'],
            maxlength: [40, 'Le pseudonyme de passe ne doit pas dépasser 40 caractères']
        },
        role: {
            type: String,
            required: [true, 'Le rôle est requis'],
            enum: {
                values: ['super-administrateur', 'administrateur', 'moderateur', 'utilisateur'],
                message: 'Le rôle "{VALUE}" est invalide.'
            },
            default: 'utilisateur'
        }
    },
    {
        timestamps: true
    }
)

userSchema.plugin(uniqueValidator)

const User = mongoose.model<IUser>('User', userSchema)

export default User
