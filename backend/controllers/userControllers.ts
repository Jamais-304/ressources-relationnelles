import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User.ts"
import RefreshToken from "../models/RefreshToken.ts"
import { formatResponse } from "../utils/formatResponse.ts"
import { errorHandler } from "../utils/errorHandler.ts"
import { generateAccesToken, generateRefreshToken } from "../utils/generateTokens.ts"
import { checkAuthentification, checkUserParams, checkUserRole } from "../utils/checkAuth.ts"
import { ROLE_HIERARCHY, ROLES } from "../config.ts"
import { type UserInterface, type UserReqBodyRequest } from "../interfaces/userInterfaces.ts"
import { type AuthRequest } from "../interfaces/authInterface.ts"

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
        // Hash the user's password
        const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

        // Create a new user instance with the hashed password
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            pseudonyme: req.body.pseudonyme,
            role: "utilisateur"
        })

        // Save the new user to the database
        await newUser.save()

        // Retrieve the newly created user from the database
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(500).json(formatResponse("Server error"))
            return
        }
        // Generate an access token for the new user
        let accessToken: string | undefined = undefined
        try {
            accessToken = generateAccesToken(user)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return  
        }

        // Generate a refresh token for the new user
        let refreshToken: string | undefined = undefined
        try {
            refreshToken = await generateRefreshToken(user)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Return the user details and tokens in the response
        res.status(201).json(
            formatResponse("User created", {
                tokens: { accessToken, refreshToken },
                user: { pseudonyme: user.pseudonyme, role: user.role }
            })
        )
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
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
            res.status(401).json(formatResponse("Incorrect username/password pair!"))
            return
        }

        // Verify the provided password with the stored hashed password
        const isValid: boolean = await bcrypt.compare(req.body.password, user.password)

        if (!isValid) {
            res.status(401).json(formatResponse("Incorrect username/password pair!"))
            return
        }

        // Generate an access token for the new user
        let accessToken: string | undefined = undefined
        try {
            accessToken = generateAccesToken(user)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Generate a refresh token for the new user
        let refreshToken: string | undefined = undefined
        try {
            refreshToken = await generateRefreshToken(user)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Return the tokens in the response
        res.status(200).json(formatResponse("Login successful", { tokens: { accessToken, refreshToken } }))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
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

        // Delete the refresh token from the database
        await RefreshToken.deleteOne({ refreshToken: refreshToken })

        // Return a success message
        res.status(200).json(formatResponse("User logged out successfully"))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
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

        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId

        // Check authentication and retrieve the authenticated user
        const user: UserInterface | null = await checkAuthentification(req)

        // Validate the presence of required fields in the request body
        if (!userObject.role || !userObject.password || !userObject.email || !userObject.pseudonyme) {
            res.status(400).json(formatResponse("Missing information"))
            return
        }

        let userRoleIndex: number = -1
        let reqUserRoleIndex: number = -1

        try {
            // Determine the role indices for the authenticated user and the requested user
            userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
            reqUserRoleIndex = checkUserRole(userObject.role)
        } catch (error: unknown) {
            // Handle errors in role checking
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Ensure both roles are valid
        if (userRoleIndex === -1 || reqUserRoleIndex === -1) {
            res.status(400).json(formatResponse("Invalid role"))
            return
        }

        // Ensure the authenticated user has sufficient permissions to create the requested user role
        if (userRoleIndex > reqUserRoleIndex) {
            res.status(403).json(formatResponse("Insufficient access"))
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
        await newUser.save()

        // Return a success message
        res.status(201).json(formatResponse("User created successfully"))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
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
            // Handle errors in role checking
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Ensure the authenticated user has sufficient permissions to access user data
        if (userRoleIndex > 1) {
            res.status(403).json(formatResponse("Insufficient access"))
            return
        }

        // Super-administrator: Retrieve all users
        if (userRoleIndex === 0) {
            const users = await User.find().select("_id email pseudonyme role createdAt updatedAt")
            res.status(200).json(formatResponse("Users found", { users: users }))
            return
        }

        // Administrator: Retrieve all users except super-administrators
        if (userRoleIndex === 1) {
            const users = await User.find({ role: { $ne: "super-administrateur" } }).select("_id email pseudonyme role createdAt updatedAt")
            res.status(200).json(formatResponse("Users found", { users: users }))
            return
        }

        // Return an error if no conditions are met
        res.status(400).json(formatResponse("No conditions met"))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
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
            // Handle errors in role checking
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Ensure the authenticated user has sufficient permissions to delete a user
        if (userRoleIndex > 1) {
            res.status(403).json(formatResponse("Insufficient access"))
            return
        }

        // Check the role of the user to be deleted
        const userRoleIndexToDelete: number = await checkUserParams(req.params.id)

        // Ensure the authenticated user has the authority to delete the specified user
        if (userRoleIndex > userRoleIndexToDelete) {
            res.status(403).json(formatResponse("Insufficient access"))
            return
        }

        // Delete the user by ID
        await User.findByIdAndDelete(req.params.id)

        // Return a success message
        res.status(200).json(formatResponse("User deleted successfully"))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
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
            // Handle errors in role checking
            const statusCode: number = errorHandler(error) || 500
            res.status(statusCode).json(formatResponse("Server error", { error: error }))
            return
        }

        // Check the role of the user to be modified
        const userRoleIndexToModify: number = await checkUserParams(req.params.id)

        // Extract user details from the request body
        const userObject: UserReqBodyRequest = req.body

        const roleExiste = userObject.role && Object.values(ROLES).includes(userObject.role)

        if (!roleExiste) {
            res.status(400).json(formatResponse("Invalid role"))
            return
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId

        // Allow users and moderators to update their own information
        if (userRoleIndex >= 1 && req.auth && req.params.id == req.auth.userId) {
            // Remove role from the request body for security reasons
            delete userObject.role
            // Update user information
            await User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
            res.status(200).json(formatResponse("User updated successfully"))
            return
        } else if (userRoleIndex <= userRoleIndexToModify) {
            // Ensure the role is valid and the authenticated user has sufficient permissions
            if (!userObject.role) {
                res.status(400).json(formatResponse("Invalid role"))
                return
            }
            if (userRoleIndex > ROLE_HIERARCHY.indexOf(userObject.role)) {
                res.status(403).json(formatResponse("Insufficient access"))
                return
            }

            // Update user information
            await User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
            res.status(200).json(formatResponse("User updated successfully"))
            return
        } else {
            // Return an error if the authenticated user is not authorized to modify the specified user
            res.status(401).json(formatResponse("Not authorized"))
            return
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        res.status(statusCode).json(formatResponse("Server error", { error: error }))
        return
    }
}
