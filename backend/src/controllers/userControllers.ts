import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User.ts"
import RefreshToken from "../models/RefreshToken.ts"
import { generateAccesToken, generateRefreshToken } from "../utils/generateTokens.ts"
import { checkAuthentification, checkUserParams, checkUserRole } from "../utils/checkAuth.ts"
import { ROLE_HIERARCHY, ROLES } from "../configs.ts"
import { type UserInterface, type UserReqBodyRequest } from "../interfaces/userInterfaces.ts"
import { type AuthRequest } from "../interfaces/authInterface.ts"
import { errorHandler } from "../handlerResponse/errorHandler/errorHandler.ts"
import { succesHandler } from "../handlerResponse/succesHandler/succesHandler.ts"
import { userCreated, userDeleted, userUpdated, loginSucces, logoutSucces, userFound } from "../handlerResponse/succesHandler/configs.ts"
import {
    unexpectedError,
    serverError,
    invRole,
    missingInfo,
    noConditions,
    noFields,
    refreshTokenRequired,
    noPasswordSet,
    newPasswordRequired,
    passwordRequired,
    unauthorized,
    incorrectPassword,
    invalidCredentials,
    insufficientAccess,
    userNotFound,
    unableInfo
} from "../handlerResponse/errorHandler/configs.ts"

/**
 * Controller for creating a new user.
 *
 * This controller handles the process of creating a new user with the provided email, password, and pseudonym.
 * It hashes the password, saves the user to the database, and generates access and refresh tokens for the new user.
 *
 * @param {Request} req - The request object containing user details in the body.
 * @param {Response} res - The response object to send the created user details and tokens or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with user details and tokens or an error message.
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract user details from the request body
        const userObject: UserReqBodyRequest = req.body
        // Check if the user is exist
        const userExist = await User.findOne({ email: userObject.email })

        if (userExist) {
            errorHandler(res, unableInfo)
            return
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId
        // Validate the presence of required fields in the request body
        if (!userObject.role || !userObject.password || !userObject.email || !userObject.pseudonyme) {
            errorHandler(res, missingInfo)
            return
        }
        // Hash the user's password
        const hashedPassword: string = await bcrypt.hash(userObject.password, 10)
        // Create a new user instance with the hashed password
        const newUser = new User({
            email: userObject.email,
            password: hashedPassword,
            pseudonyme: userObject.pseudonyme,
            role: "utilisateur"
        })
        // Save the new user to the database
        const savedUser = await newUser.save()

        if (!savedUser) {
            errorHandler(res, serverError)
            return
        }
        // Generate an access token for the new user
        let accessToken: string | undefined = undefined
        try {
            accessToken = generateAccesToken(savedUser)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : unexpectedError
            errorHandler(res, errorMessage)
            return
        }
        // Generate a refresh token for the new user
        let refreshToken: string | undefined = undefined
        try {
            refreshToken = await generateRefreshToken(savedUser)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : unexpectedError
            errorHandler(res, errorMessage)
            return
        }
        // Return the user details and tokens in the response
        succesHandler(res, userCreated, {
            tokens: { accessToken, refreshToken },
            user: { pseudonyme: savedUser.pseudonyme, role: savedUser.role, email: savedUser.email }
        })
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}
/**
 * Controller for user login.
 *
 * This controller handles the process of authenticating a user based on the provided email and password.
 * It verifies the credentials, and if valid, generates access and refresh tokens for the user.
 *
 * @param {Request} req - The request object containing user credentials in the body.
 * @param {Response} res - The response object to send the tokens or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with tokens or an error message.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email })
        // Check if the user exists and has a password
        if (!user || !user.password) {
            errorHandler(res, invalidCredentials)
            return
        }
        // Verify the provided password with the stored hashed password
        const isValid: boolean = await bcrypt.compare(req.body.password, user.password)

        if (!isValid) {
            errorHandler(res, invalidCredentials)
            return
        }

        // Generate an access token for the new user
        let accessToken: string | undefined = undefined
        try {
            accessToken = generateAccesToken(user)
        } catch (error: unknown) {
            // Handle unexpected errors
            const errorType = error instanceof Error ? error.message : unexpectedError
            errorHandler(res, errorType)
            return
        }

        // Generate a refresh token for the new user
        let refreshToken: string | undefined = undefined
        try {
            refreshToken = await generateRefreshToken(user)
        } catch (error: unknown) {
            // Handle unexpected errors
            const errorType = error instanceof Error ? error.message : unexpectedError
            errorHandler(res, errorType)
            return
        }

        const userObject = user.toObject ? user.toObject() : user

        // Remove user password before sending response
        delete userObject.password
        // Return the tokens in the response
        succesHandler(res, loginSucces, { tokens: { accessToken, refreshToken }, user: userObject })
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}

/**
 * Controller for user logout.
 *
 * This controller handles the process of logging out a user by invalidating their refresh token.
 * It deletes the refresh token from the database, effectively logging the user out.
 *
 * @param {Request} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with a success message or an error message.
 */
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract the refresh token from the request body
        const refreshToken: string = req.body.refreshToken

        if (!refreshToken) {
            errorHandler(res, refreshTokenRequired)
            return
        }
        // Delete the refresh token from the database
        await RefreshToken.deleteOne({ refreshToken: refreshToken })
        // Return a success message
        succesHandler(res, logoutSucces)
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}

/**
 * Controller for user/admin registration with authentication.
 *
 * This controller handles the process of registering a new user or admin by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions to create a user with the requested role.
 *
 * @param {AuthRequest} req - The authenticated request object containing user details in the body.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with a success message or an error message.
 */
export const adminCreateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Extract user details from the request body
        const userObject: UserReqBodyRequest = req.body
        // Check if the user is exist
        const userExist = await User.findOne({ email: userObject.email })

        if (userExist) {
            errorHandler(res, unableInfo)
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId

        // Validate the presence of required fields in the request body
        if (!userObject.role || !userObject.password || !userObject.email || !userObject.pseudonyme) {
            errorHandler(res, missingInfo)
            return
        }
        // Check authentication and retrieve the authenticated user
        const user: UserInterface | null = await checkAuthentification(req)

        let userRoleIndex: number = -1
        let reqUserRoleIndex: number = -1

        try {
            // Determine the role indices for the authenticated user and the requested user
            userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
            reqUserRoleIndex = checkUserRole(userObject.role)
        } catch (error: unknown) {
            // Handle unexpected errors
            const errorType = error instanceof Error ? error.message : serverError
            errorHandler(res, errorType)
            return
        }

        // Ensure both roles are valid
        if (userRoleIndex === -1 || reqUserRoleIndex === -1) {
            errorHandler(res, invRole)
            return
        }

        // Ensure the authenticated user has sufficient permissions to create the requested user role
        if (userRoleIndex > reqUserRoleIndex) {
            errorHandler(res, insufficientAccess)
            return
        }

        // Hash the new user's password
        const hashedPassword: string = await bcrypt.hash(userObject.password, 10)

        // Create a new user instance with the hashed password
        const newUser = new User({
            email: userObject.email,
            password: hashedPassword,
            pseudonyme: userObject.pseudonyme,
            role: userObject.role
        })

        // Save the new user to the database
        const savedUser = await newUser.save()

        // Return a success message
        succesHandler(res, userCreated, {
            user: { pseudonyme: savedUser.pseudonyme, role: savedUser.role, email: savedUser.email }
        })
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}

/**
 * Controller for retrieving all user registrations with authentication.
 *
 * This controller handles the process of retrieving all user registrations by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions to access user data.
 *
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object to send the list of users or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with the list of users or an error message.
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Check authentication and retrieve the authenticated user
        const user: UserInterface | null = await checkAuthentification(req)

        let userRoleIndex: number = -1

        try {
            // Determine the role index for the authenticated user
            userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
        } catch (error: unknown) {
            const errorType = error instanceof Error ? error.message : serverError
            errorHandler(res, errorType)
            // res.status(statusCode).json(errorResponse({ msg: errorMessage }))
            return
        }

        // Ensure the authenticated user has sufficient permissions to access user data
        if (userRoleIndex > 1) {
            errorHandler(res, insufficientAccess)
            return
        }

        // Super-administrator: Retrieve all users
        if (userRoleIndex === 0) {
            const users = await User.find().select("_id email pseudonyme role createdAt updatedAt")
            succesHandler(res, userFound, { users: users })
            return
        }

        // Administrator: Retrieve all users except super-administrators
        if (userRoleIndex === 1) {
            const users = await User.find({ role: { $ne: "super-administrateur" } }).select("_id email pseudonyme role createdAt updatedAt")
            succesHandler(res, userFound, { users: users })
            return
        }
        // Return an error if no conditions are met
        errorHandler(res, noConditions)
        return
    } catch (error: unknown) {
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}

/**
 * Controller for deleting a user by ID with authentication.
 *
 * This controller handles the process of deleting a user by their ID, performed by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions to delete the specified user.
 *
 * @param {AuthRequest} req - The authenticated request object containing the user ID in the parameters.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with a success message or an error message.
 */
export const deleteUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Check authentication and retrieve the authenticated user
        const user: UserInterface | null = await checkAuthentification(req)

        let userRoleIndex: number = -1

        try {
            // Determine the role index for the authenticated user
            userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
        } catch (error: unknown) {
            const errorType = error instanceof Error ? error.message : serverError
            errorHandler(res, errorType)
            return
        }

        // Ensure the authenticated user has sufficient permissions to delete a user
        if (userRoleIndex > 1) {
            errorHandler(res, insufficientAccess)
            return
        }

        // Check the role of the user to be deleted
        const userRoleIndexToDelete: number = await checkUserParams(req.params.id)

        // Ensure the authenticated user has the authority to delete the specified user
        if (userRoleIndex > userRoleIndexToDelete) {
            errorHandler(res, insufficientAccess)
            return
        }

        // Delete the user by ID
        await User.findByIdAndDelete(req.params.id)

        // Return a success message
        succesHandler(res, userDeleted)
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}

/**
 * Controller for modifying a user by ID with authentication.
 *
 * This controller handles the process of updating a user's information by their ID, performed by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions to modify the specified user.
 *
 * @param {AuthRequest} req - The authenticated request object containing the user ID in the parameters and updated details in the body.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with a success message or an error message.
 */

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Check authentication and retrieve the authenticated user
        const user: UserInterface | null = await checkAuthentification(req)

        let userRoleIndex: number = -1

        try {
            // Determine the role index for the authenticated user
            userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
        } catch (error: unknown) {
            // Handle unexpected errors
            const errorType = error instanceof Error ? error.message : serverError
            errorHandler(res, errorType)
            return
        }
        // Check the role of the user to be modified
        const userRoleIndexToModify: number = await checkUserParams(req.params.id)

        // Extract user details from the request body
        const userObject: UserReqBodyRequest = req.body
        if (userObject.role && !Object.values(ROLES).includes(userObject.role)) {
            errorHandler(res, invRole)
            return
        }

        if ((userObject.password && !userObject.newPassword) || (!userObject.password && userObject.newPassword)) {
            errorHandler(res, userObject.password ? newPasswordRequired : passwordRequired)
            return
        }

        // Find the user by email
        const userReq: UserInterface | null = await User.findOne({ email: req.body.email })

        // Check if the user exists and has a password
        if (!userReq) {
            errorHandler(res, userNotFound)
            return
        }

        if (!userReq.password) {
            errorHandler(res, noPasswordSet)
            return
        }

        if (userObject.password) {
            // Verify the provided password with the stored hashed password
            const isValid: boolean = await bcrypt.compare(userObject.password, userReq.password)
            if (!isValid) {
                errorHandler(res, incorrectPassword)
                return
            }
        }

        if (userObject.newPassword) {
            const hashedPassword: string = await bcrypt.hash(userObject.newPassword, 10)
            userObject.password = hashedPassword
            delete userObject.newPassword // Supprimer newPassword pour éviter de l'enregistrer par erreur
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId
        delete userObject._id
        delete userObject.uuid

        if (Object.keys(userObject).length === 0) {
            errorHandler(res, noFields)
            return
        }

        // Allow users and moderators to update their own information
        if (userRoleIndex >= 1 && req.auth && req.params.id == req.auth.userId) {
            // Remove role from the request body for security reasons
            delete userObject.role
            // Update user information
            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: { ...userObject } }, { new: true })
            if (!updateUser) {
                errorHandler(res, userNotFound)
                return
            }
            succesHandler(res, userUpdated, { user: updateUser })
            return
        } else if (userRoleIndex <= userRoleIndexToModify) {
            // Ensure the role is valid and the authenticated user has sufficient permissions
            if (userObject.role) {
                if (userRoleIndex > ROLE_HIERARCHY.indexOf(userObject.role)) {
                    errorHandler(res, insufficientAccess)
                    return
                }
            }
            // Update user information
            const updateUser: UserInterface | null = await User.findByIdAndUpdate(req.params.id, { $set: { ...userObject } }, { new: true })

            if (!updateUser) {
                errorHandler(res, userNotFound)
                return
            }
            succesHandler(res, userUpdated, { user: updateUser })
            return
        } else {
            errorHandler(res, unauthorized)
            return
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const errorType = error instanceof Error ? error.message : serverError
        errorHandler(res, errorType)
        return
    }
}
