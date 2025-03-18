import User from "../models/User.ts"
import { ROLE_HIERARCHY, type Role } from "../config.ts"
import { type UserInterface, type UserReqBodyRequest } from "../interfaces/userInterfaces.ts"
import { type AuthRequest } from "../interfaces/authInterface.ts"

/**
 * Function to check the authentication of a request.
 *
 * This function verifies if the request is authenticated by checking the presence of a user ID in the request's auth object.
 * It retrieves the user from the database using the user ID and returns the user object if found.
 *
 */

export const checkAuthentification = async (req: AuthRequest) => {
    if (!req.auth || !req.auth.userId) throw new Error("Accès non autorisé")

    const user: UserInterface | null = await User.findById(req.auth.userId)

    return user
}

/**
 * Function to check the role of a user.
 *
 * This function takes a user role and returns its index in the role hierarchy.
 * If the role is not found in the hierarchy, it throws an error.
 *
 */

export const checkUserRole = (userRole: Role) => {
    const userRoleIndex: number = ROLE_HIERARCHY.indexOf(userRole)

    if (userRoleIndex === -1) throw new Error("Rôle invalide")

    return userRoleIndex
}

/**
 * Function to check the role of a user specified by an ID in the request parameters.
 *
 * This function retrieves the user from the database using the provided user ID and returns the index of the user's role in the role hierarchy.
 * If the user or the role is not found, it throws an error.
 *
 */

export const checkUserParams = async (userParamsId: string) => {
    const userParams: UserReqBodyRequest | null = await User.findById(userParamsId)

    if (!userParams || !userParams.role) throw new Error("Rôle invalide")

    const userParamsRoleIndex: number = ROLE_HIERARCHY.indexOf(userParams.role)

    return userParamsRoleIndex
}
