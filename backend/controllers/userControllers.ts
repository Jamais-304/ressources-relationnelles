import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.ts"
import RefreshToken from "../models/RefreshToken.ts"
import { ROLE_HIERARCHY, type Role } from "../config.ts"
import { type UserInterface } from "../interfaces/userInterfaces.ts"
//////////////////////////////////////////////////*?Interfaces ////////////////////////////////////////

interface DecodedToken {
    userId: string
    role: Role
}

interface IUserToken extends Pick<UserInterface, "role"> {
    _id: string
}

interface AuthRequest extends Request {
    auth?: {
        userId: string
    }
}
//////////////////////////////////////////////////*?Interfaces ////////////////////////////////////////
//////////////////////////* Functions for generate accesToken & RefreshToken //////////////////////////

const generateAccesToken = (user: IUserToken) => {
    const secretKey: string | undefined = process.env.TOKEN_SECRET
    if (!secretKey) {
        console.error("La clé secrète n'est pas définie")
        return
    }

    const accesToken = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: "15m" })

    return accesToken
}

const generateRefreshToken = async (user: IUserToken) => {
    const secretKey: string | undefined = process.env.TOKEN_SECRET

    if (!secretKey) {
        console.error("La clé secrète n'est pas définie")
        return
    }

    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, secretKey, { expiresIn: "7d" })

    await RefreshToken.create({ refreshToken: refreshToken, userId: user._id })

    return refreshToken
}

////////////////////////////////* Controller for user registration  //////////////////////////////////

export const adminCreateUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const reqUser = req.body
        delete reqUser.userId
        const newUserRole = reqUser.role

        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ data: { message: "Accès non autorisé" } })
        }

        const userIdVerify = req.auth.userId

        const user = await User.findById(userIdVerify)

        if (!user || !user.role) return res.status(401).json({ data: { message: "Accès non autorisé" } })

        const userRoleIndex = ROLE_HIERARCHY.indexOf(user.role)
        const reqUserRoleIndex = ROLE_HIERARCHY.indexOf(newUserRole)

        if (userRoleIndex === -1 || reqUserRoleIndex === -1) return res.status(400).json({ data: { message: "Rôle invalide" } })
        console.log(userRoleIndex > reqUserRoleIndex)

        if (userRoleIndex > reqUserRoleIndex) return res.status(403).json({ data: { message: "Accès insuffisant" } })

        const hashedPassword = await bcrypt.hash(reqUser.password, 10)

        const newUser = new User({
            email: reqUser.email,
            password: hashedPassword,
            pseudonyme: reqUser.pseudonyme,
            role: newUserRole
        })

        await newUser.save()

        return res.status(201).json({ data: { message: "Utilisateur crée avec succès" } })
    } catch (error: unknown) {
        console.error(error)

        return res.status(500).json({ data: { message: "Erreur serveur", error } })
    }
}

////////////////////////////////* Controller for user registration  //////////////////////////////////

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            pseudonyme: req.body.pseudonyme,
            role: "utilisateur"
        })

        await newUser.save()

        return res.status(201).json({ message: "Utilisateur crée avec succès", user: newUser })
    } catch (error: unknown) {
        console.error(error)

        return res.status(500).json({ message: "Erreur serveur", error })
    }
}

////////////////////////////////* Controller for user login /////////////////////////////////////////

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) return res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte !" })

        const isValid = await bcrypt.compare(req.body.password, user.password)

        if (!isValid) return res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte !" })

        const accesToken = generateAccesToken(user)

        if (!accesToken) return res.status(500).json({ message: "Erreur serveur" })

        const refreshToken = await generateRefreshToken(user)

        if (!refreshToken) return res.status(500).json({ message: "Erreur serveur" })

        return res.status(200).json({ accesToken: accesToken, refreshToken: refreshToken })
    } catch (error: unknown) {
        console.error(error)
        return res.status(500).json({ message: "Erreur serveur", error })
    }
}
////////////////////////////////* Controller for refresh token  ///////////////////////////////////////

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.body.refreshToken

        if (!refreshToken) return res.status(401).json({ message: "Token invalide" })

        const secretKey: string | undefined = process.env.TOKEN_SECRET

        if (!secretKey) {
            console.error("La clé secrète n'est pas définie")
            return res.status(500).json({ message: "Erreur serveur" })
        }

        const storedToken = await RefreshToken.findOne({ refreshToken: refreshToken })

        if (!storedToken) return res.status(403).json({ message: "Token invalide" })

        try {
            const decoded = jwt.verify(refreshToken, secretKey) as DecodedToken

            const user = { _id: decoded.userId, role: decoded.role }

            const newAccesToken = generateAccesToken(user)

            return res.status(201).json({ accesToken: newAccesToken })
        } catch (error: unknown) {
            console.error(error)
            return res.status(403).json({ message: "Refresh Token expiré" })
        }
    } catch (error: unknown) {
        console.error(error)
        return res.status(500).json({ message: "Erreur serveur", error })
    }
}

////////////////////////////////* Controller for user logout /////////////////////////////////////////

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const refreshToken = req.body.refreshToken
        await RefreshToken.deleteOne({ refreshToken: refreshToken })
        return res.status(200).json({ message: "Utilisateur déconnecté avec succès" })
    } catch (error: unknown) {
        console.error(error)
        return res.status(500).json({ message: "Erreur serveur", error })
    }
}
