import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User.ts"
import RefreshToken from "../models/RefreshToken.ts"
import { dataResponse, errorResponse } from "../utils/formatResponse.ts"
import { errorHandler } from "../utils/errorHandler.ts"
import { generateAccesToken, generateRefreshToken } from "../utils/generateTokens.ts"
import { checkAuthentification, checkUserParams, checkUserRole } from "../utils/checkAuth.ts"
import { ROLE_HIERARCHY, ROLES } from "../../config.ts"
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
        // Extract user details from the request body
        const userObject: UserReqBodyRequest = req.body
        // Check if the user is exist
        const userExist = await User.findOne({ email: userObject.email })

        if (userExist) {
            res.status(409).json(errorResponse({ location: "body", msg: "Unable to create account with the provided information" }))
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId
        // Validate the presence of required fields in the request body
        if (!userObject.role || !userObject.password || !userObject.email || !userObject.pseudonyme) {
            res.status(400).json(errorResponse({ location: "body", msg: "Missing information" }))
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
            res.status(500).json(errorResponse({ msg: "Server error" }))
            return
        }
        // Generate an access token for the new user
        let accessToken: string | undefined = undefined
        try {
            accessToken = generateAccesToken(savedUser)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        // Generate a refresh token for the new user
        let refreshToken: string | undefined = undefined
        try {
            refreshToken = await generateRefreshToken(savedUser)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        // Return the user details and tokens in the response
        res.status(201).json(
            dataResponse("User created successfully", {
                tokens: { accessToken, refreshToken },
                user: { pseudonyme: savedUser.pseudonyme, role: savedUser.role, email: savedUser.email }
            })
        )
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
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
            res.status(401).json(errorResponse({ location: "body", msg: "Incorrect username/password pair!" }))

            return
        }

        // Verify the provided password with the stored hashed password
        const isValid: boolean = await bcrypt.compare(req.body.password, user.password)

        if (!isValid) {
            res.status(401).json(errorResponse({ location: "body", msg: "Incorrect username/password pair!" }))
            return
        }

        // Generate an access token for the new user
        let accessToken: string | undefined = undefined
        try {
            accessToken = generateAccesToken(user)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        // Generate a refresh token for the new user
        let refreshToken: string | undefined = undefined
        try {
            refreshToken = await generateRefreshToken(user)
        } catch (error: unknown) {
            const statusCode: number = errorHandler(error) || 500
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        const userObject = user.toObject ? user.toObject() : user

        // Remove user password before sending response
        delete userObject.password
        // Return the tokens in the response
        res.status(200).json(dataResponse("Login successful", { tokens: { accessToken, refreshToken }, user: userObject }))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
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
            res.status(400).json(errorResponse({ location: "body", msg: "Refresh token is required" }))
            return
        }
        // Delete the refresh token from the database
        await RefreshToken.deleteOne({ refreshToken: refreshToken })
        // Return a success message
        res.status(200).json(dataResponse("User logged out successfully"))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
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
            res.status(409).json(errorResponse({ location: "body", msg: "Unable to create account with the provided information" }))
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId

        // Validate the presence of required fields in the request body
        if (!userObject.role || !userObject.password || !userObject.email || !userObject.pseudonyme) {
            res.status(400).json(errorResponse({ location: "body", msg: "Missing information" }))
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
            // Handle errors in role checking
            const statusCode: number = errorHandler(error) || 500
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        // Ensure both roles are valid
        if (userRoleIndex === -1 || reqUserRoleIndex === -1) {
            res.status(400).json(errorResponse({ msg: "Invalid role" }))
            return
        }

        // Ensure the authenticated user has sufficient permissions to create the requested user role
        if (userRoleIndex > reqUserRoleIndex) {
            res.status(403).json(errorResponse({ msg: "Insufficient access" }))
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
        res.status(201).json(
            dataResponse("User created successfully", {
                user: { pseudonyme: savedUser.pseudonyme, role: savedUser.role, email: savedUser.email }
            })
        )
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
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
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        // Ensure the authenticated user has sufficient permissions to access user data
        if (userRoleIndex > 1) {
            res.status(403).json(errorResponse({ msg: "Insufficient access" }))
            return
        }

        // Super-administrator: Retrieve all users
        if (userRoleIndex === 0) {
            const users = await User.find().select("_id email pseudonyme role createdAt updatedAt")
            res.status(200).json(dataResponse("Users found", { users: users }))
            return
        }

        // Administrator: Retrieve all users except super-administrators
        if (userRoleIndex === 1) {
            const users = await User.find({ role: { $ne: "super-administrateur" } }).select("_id email pseudonyme role createdAt updatedAt")
            res.status(200).json(dataResponse("Users found", { users: users }))
            return
        }

        // Return an error if no conditions are met
        res.status(400).json(errorResponse({ msg: "No conditions met" }))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
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
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }

        // Ensure the authenticated user has sufficient permissions to delete a user
        if (userRoleIndex > 1) {
            res.status(403).json(errorResponse({ msg: "Insufficient access" }))
            return
        }

        // Check the role of the user to be deleted
        const userRoleIndexToDelete: number = await checkUserParams(req.params.id)

        // Ensure the authenticated user has the authority to delete the specified user
        if (userRoleIndex > userRoleIndexToDelete) {
            res.status(403).json(errorResponse({ msg: "Insufficient access" }))
            return
        }

        // Delete the user by ID
        await User.findByIdAndDelete(req.params.id)

        // Return a success message
        res.status(200).json(dataResponse("User deleted successfully"))
        return
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
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
            console.error(error)
            res.status(statusCode).json(errorResponse({ msg: "Server error" }))
            return
        }
        // Check the role of the user to be modified
        const userRoleIndexToModify: number = await checkUserParams(req.params.id)

        // Extract user details from the request body
        const userObject: UserReqBodyRequest = req.body
        if (userObject.role && !Object.values(ROLES).includes(userObject.role)) {
            res.status(400).json(errorResponse({ msg: "Role is unavailable" }))
            return
        }
        // Remove any user IDs from the request body for security reasons
        delete userObject.id
        delete userObject.userId
        delete userObject._id
        delete userObject.uuid

        if (Object.keys(userObject).length === 0) {
            res.status(400).json(errorResponse({ msg: "No fields provided for update" }))
            return
        }

        if (userObject.password) {
            const hashedPassword: string = await bcrypt.hash(userObject.password, 10)
            userObject.password = hashedPassword
        }
        // Allow users and moderators to update their own information
        if (userRoleIndex >= 1 && req.auth && req.params.id == req.auth.userId) {
            // Remove role from the request body for security reasons
            delete userObject.role
            // Update user information
            const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: { ...userObject } }, { new: true })
            if (!updateUser) {
                res.status(404).json(errorResponse({ msg: "Not found" }))
                return
            }
            res.status(200).json(dataResponse("User updated successfully", { user: updateUser }))
            return
        } else if (userRoleIndex <= userRoleIndexToModify) {
            // Ensure the role is valid and the authenticated user has sufficient permissions
            if (!userObject.role) {
                res.status(400).json(errorResponse({ msg: "Invalid role" }))
                return
            }
            if (userRoleIndex > ROLE_HIERARCHY.indexOf(userObject.role)) {
                res.status(403).json(errorResponse({ msg: "Insufficient access" }))
                return
            }
            // Update user information
            const updateUser: UserInterface | null = await User.findByIdAndUpdate(req.params.id, { $set: { ...userObject } }, { new: true })

            if (!updateUser) {
                res.status(404).json(errorResponse({ msg: "Not found" }))
                return
            }
            res.status(200).json(dataResponse("User updated successfully", { user: updateUser }))
            return
        } else {
            // Return an error if the authenticated user is not authorized to modify the specified user
            res.status(401).json(errorResponse({ msg: "Not authorized" }))
            return
        }
    } catch (error: unknown) {
        // Handle unexpected errors
        const statusCode: number = errorHandler(error) || 500
        console.error(error)
        res.status(statusCode).json(errorResponse({ msg: "Server error" }))
        return
    }
}
