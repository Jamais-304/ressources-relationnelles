import type { Request, Response } from 'express'
import User from '../models/User.ts'
import bcrypt from 'bcrypt'

export const createUser = async (req: Request, res: Response)=> {
    try {

        const { email, password, pseudonyme, role } = req.body
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        const existingUser = await User.findOne({ email })
        
        if (existingUser) {
            return res.status(400).json({ message: 'L\'email est déjà utilisé' })
        }

        const newUser = new User({
            email: email,
            password: hashedPassword,
            pseudonyme: pseudonyme,
            role: role,
        })

        await newUser.save()

        return res.status(201).json(
            { 
                message: 'Utilisateur crée avec succès',
                 user: newUser 
                }
            )

    } catch (error) {

        console.error(error)
        return res.status(500).json(
            {
                message: 'Erreur serveur',
                error 
            })

    }
}