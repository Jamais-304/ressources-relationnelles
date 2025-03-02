import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Adresse email invalide'] },
    password: { type: String, required: true, trim: true, minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'] },
    pseudonyme: { type: String, required: true, trim: true, minlength: [5, 'Le pseudonyme doit contenir au moins 5 caractères'] },
    role: { type: String, required: true, enum: ['super-administrateur', 'administrateur', 'moderateur', 'utilisateur'], default: 'utilisateur' }
}, { timestamps: true })

userSchema.plugin(uniqueValidator)

export default mongoose.model('User', userSchema)
