import type { Request, Response } from 'express'
import User from '../models/User.ts'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            pseudonyme: req.body.pseudonyme,
            role: req.body.role,
        })

        await newUser.save()

        return res.status(201).json({
            message: 'Utilisateur crée avec succès',
            user: newUser
        })

    } catch (error: unknown) {
        console.error(error)
        return res.status(500).json({ message: 'Erreur serveur', error })
    }
}

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        const user = await User.findOne({ email: req.body.email })
        const secretKey: string | undefined = process.env.TOKEN_SECRET

        if (!user) {
            return res.status(401).json({
                message: "Paire identifiant/mot de passe incorrecte !",
            })
        }
        const isValid = await bcrypt.compare(req.body.password, user.password)
        if (!isValid) {
            return res.status(401).json({
                message: "Paire identifiant/mot de passe incorrecte !",
            })
        }
        if (!secretKey) {
            console.error('La clé secrète n\'est pas définie')
            return res.status(500).json({ message: 'Erreur serveur : clé secrète manquante' })
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: '1h' })

        return res.status(200).json({ token })


    } catch (error: unknown) {
        console.error(error)
        return res.status(500).json({ message: 'Erreur serveur', error })
    }
}