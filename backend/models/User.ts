import mongoose, {Document, Schema} from 'mongoose'
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
            required: true,
            unique: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Adresse email invalide'] 
        },
        password: {
            type: String,
            required: true, 
            trim: true, 
            minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'] 
        },
        pseudonyme: {
            type: String, 
            required: true, 
            trim: true, 
            minlength: [5, 'Le pseudonyme doit contenir au moins 5 caractères'] 
        },
        role: { 
            type: String, 
            required: true, 
            enum: ['super-administrateur', 'administrateur', 'moderateur', 'utilisateur'],
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
