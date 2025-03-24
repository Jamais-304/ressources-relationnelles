import request from "supertest"
import bcrypt from "bcrypt"
import app from "../../app.ts"
import User from "../../models/User.ts"
import mongoose from "mongoose"
import RefreshToken from "../../models/RefreshToken.ts"
import { generateAccesToken, generateRefreshToken } from "../../utils/generateTokens.ts"
import { checkAuthentification, checkUserRole } from "../../utils/checkAuth.ts"
import { ROLE_HIERARCHY } from "../../../config.ts"

jest.mock("bcrypt")
jest.mock("../../models/User.ts")
jest.mock("../../utils/generateTokens.ts", () => ({
    generateAccesToken: jest.fn(),
    generateRefreshToken: jest.fn()
}))
jest.mock("../../utils/checkAuth.ts")
jest.mock("../../middleware/auth.ts", () => ({
    auth: jest.fn((req, res, next) => {
        req.auth = { userId: "1234" }
        next()
    })
}))

const accessToken = "accessToken"
const refreshToken = "refreshToken"

const adminUser = {
    _id: "1234",
    email: "admin@test.com",
    role: "super-administrateur",
    pseudonyme: "usertest",
    password: "hashedPassword"
}
const newUser = {
    email: "test@test.com",
    password: "testtest",
    pseudonyme: "usertest",
    role: "utilisateur"
}
const loginData = { email: "test@test.com", password: "testtest" }

const errorLoginData = { email: "error@test.com", password: "errorError" }

const errorLoginPassword = {
    _id: "123",
    email: "error@test.com",
    password: "hashedPassword",
    pseudonyme: "usertest",
    role: "utilisateur"
}

beforeEach(() => {
    jest.clearAllMocks()

    const mockUser = {
        _id: "123",
        email: "test@test.com",
        password: "hashedPassword",
        pseudonyme: "usertest",
        role: "utilisateur"
    }

    ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockUser.password)
    ;(User.prototype.save as jest.Mock).mockResolvedValue(mockUser)
    ;(User.findOne as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(generateAccesToken as jest.Mock).mockReturnValue(accessToken)
    ;(generateRefreshToken as jest.Mock).mockResolvedValue(refreshToken)
    ;(checkAuthentification as jest.Mock).mockResolvedValue(adminUser)
    ;(checkUserRole as jest.Mock).mockResolvedValue(ROLE_HIERARCHY.indexOf("super-administrateur"))
})

describe("User Controller", () => {
    it("should create a new user", async () => {
        // Send a POST request to the user creation endpoint with the new user data
        const response = await request(app).post("/api/v1/users/create-user").send(newUser)
        // Check that the response status is 201 (Created)
        expect(response.status).toBe(201)
        // Check that the response contains a 'data' property
        expect(response.body).toHaveProperty("data")
        // Verify that the response contains the 'tokens' property inside 'data'
        expect(response.body.data).toHaveProperty("tokens")
        // Check that the 'tokens' object contains 'accessToken' and 'refreshToken'
        expect(response.body.data.tokens).toHaveProperty("accessToken")
        expect(response.body.data.tokens).toHaveProperty("refreshToken")
        // Verify that the 'accessToken' and 'refreshToken' contain the expected mock values
        expect(response.body.data.tokens.accessToken).toBe(accessToken)
        expect(response.body.data.tokens.refreshToken).toBe(refreshToken)
        // Ensure that both 'accessToken' and 'refreshToken' are strings and not empty
        expect(typeof response.body.data.tokens.accessToken).toBe("string")
        expect(response.body.data.tokens.accessToken.length).toBeGreaterThan(0)

        expect(typeof response.body.data.tokens.refreshToken).toBe("string")
        expect(response.body.data.tokens.refreshToken.length).toBeGreaterThan(0)
        // Check that the response contains the correct user information (pseudonyme and role)
        expect(response.body.data.user).toHaveProperty("pseudonyme", "usertest")
        expect(response.body.data.user).toHaveProperty("role", "utilisateur")
    })
})

describe("User Controller - Login", () => {
    it("should successfully login a user with valid credentials", async () => {
        // Send a POST request to the login endpoint with the login data
        const response = await request(app).post("/api/v1/users/login").send(loginData)
        // Verify that the response status is 200 (OK) for a successful login
        expect(response.status).toBe(200)
        // Check that the bcrypt.compare function was called during the process
        expect(bcrypt.compare).toHaveBeenCalled()
        // Check that the response body contains the 'tokens' property
        expect(response.body.data).toHaveProperty("tokens")
        // Ensure that the 'tokens' object contains 'accessToken' and 'refreshToken'
        expect(response.body.data.tokens).toHaveProperty("accessToken")
        expect(response.body.data.tokens).toHaveProperty("refreshToken")
        // Verify that the 'accessToken' and 'refreshToken' contain the expected mock values
        expect(response.body.data.tokens.accessToken).toBe(accessToken)
        expect(response.body.data.tokens.refreshToken).toBe(refreshToken)
        // Ensure that both 'accessToken' and 'refreshToken' are strings and not empty

        expect(typeof response.body.data.tokens.accessToken).toBe("string")
        expect(response.body.data.tokens.accessToken.length).toBeGreaterThan(0)

        expect(typeof response.body.data.tokens.refreshToken).toBe("string")
        expect(response.body.data.tokens.refreshToken.length).toBeGreaterThan(0)
    })

    it("should return error if no user are found", async () => {
        // Mocking User.findOne to return null, simulating a case where no user is found
        ;(User.findOne as jest.Mock).mockResolvedValue(null)
        // Send a POST request to the login endpoint with invalid login data
        const response = await request(app).post("/api/v1/users/login").send(errorLoginData)
        // Ensure that User.findOne was called with the correct email
        expect(User.findOne).toHaveBeenCalledWith({ email: errorLoginData.email })
        // Verify that the response contains the 'message' property
        expect(response.body).toHaveProperty("message")
        // Check that the response status is 401 (Unauthorized) as no user was found
        expect(response.status).toBe(401)
        // Ensure the error message is "Incorrect username/password pair!"
        expect(response.body.message).toBe("Incorrect username/password pair!")
    })

    it("should return error if the password does not match the stored password", async () => {
        // Mocking User.findOne to return a user with invalid password data
        ;(User.findOne as jest.Mock).mockResolvedValue(errorLoginPassword)
        // Mocking bcrypt.compare to return false, simulating a password mismatch
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
        // Send a POST request to the login endpoint with invalid login data
        const response = await request(app).post("/api/v1/users/login").send(errorLoginData)
        // Ensure that User.findOne was called with the correct email
        expect(User.findOne).toHaveBeenCalledWith({ email: errorLoginData.email })
        // Verify that the response contains the 'message' property
        expect(response.body).toHaveProperty("message")
        // Check that the response status is 401 (Unauthorized) as the password did not match
        expect(response.status).toBe(401)
        // Ensure the error message is "Incorrect username/password pair!"
        expect(response.body.message).toBe("Incorrect username/password pair!")
    })
})

describe("User Controller - Logout", () => {
    it("should sucesfully logout user", async () => {
        const testRefreshToken = new RefreshToken({
            refreshToken: refreshToken,
            userId: new mongoose.Types.ObjectId()
        })
        // Save the test refresh token to the database
        await testRefreshToken.save()
        // Send a POST request to the logout endpoint with the test refresh token
        const response = await request(app).post("/api/v1/users/logout").send({ refreshToken: refreshToken })
        // Assert that the response status is 200 (OK)
        expect(response.status).toBe(200)
        // Assert that the response body contains the success message
        expect(response.body).toEqual({ message: "User logged out successfully" })
        // Attempt to find the deleted refresh token in the database
        const deletedToken = await RefreshToken.findOne({
            refreshToken: refreshToken
        })
        // Assert that the refresh token has been deleted (is null)
        expect(deletedToken).toBeNull()
    })
    it("should handle logout when refresh token does not exist", async () => {
        // Send a POST request to the logout endpoint with a non-existent refresh token
        const response = await request(app).post("/api/v1/users/logout").send({ refreshToken: "non-existent-token" })
        // Assert that the response status is 200 (OK)
        expect(response.status).toBe(200)
        // Assert that the response body contains the success message
        expect(response.body).toEqual({
            message: "User logged out successfully"
        })
    })
    it("should return error when no refresh token is provided", async () => {
        // Send a POST request to the logout endpoint without a refresh token
        const response = await request(app).post("/api/v1/users/logout").send({})
        // Assert that the response status is 400 (Bad Request)
        expect(response.status).toBe(400)
        // Assert that the response body contains an error property
        expect(response.body).toHaveProperty("error")
        // Assert that the error message indicates the refresh token must be a string
        expect(response.body.error[0]).toHaveProperty("msg", "Refresh token must be a string")
        // Assert that the error path is "refreshToken"
        expect(response.body.error[0]).toHaveProperty("path", "refreshToken")
    })
})

describe("User Controller - Admin create user", () => {
    // Setup to run before each test case
    beforeEach(() => {
        // Clear all mock calls
        jest.clearAllMocks()
        // Mock the save method of the User model to resolve with a predefined user object
        ;(User.prototype.save as jest.Mock).mockResolvedValue({
            ...newUser,
            _id: "123"
        })
    })
    // Test case to verify successful user creation by an admin
    it("should successfully create a user by an admin", async () => {
        // Send a POST request to the admin create user endpoint with new user data
        const response = await request(app).post("/api/v1/users/admin/create-user").send(newUser)
        // Assert that the response status is 201 (Created)
        expect(response.status).toBe(201)
        // Assert that the response body contains the success message
        expect(response.body).toHaveProperty("message", "User created successfully")
        // Assert that the checkAuthentification function was called
        expect(checkAuthentification).toHaveBeenCalled()
        // Assert that the checkUserRole function was called with the admin user's role
        expect(checkUserRole).toHaveBeenCalledWith(adminUser.role)
        // Assert that the checkUserRole function was called with the new user's role
        expect(checkUserRole).toHaveBeenCalledWith(newUser.role)
        // Assert that the bcrypt.hash function was called with the new user's password and salt rounds
        expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10)
    })
})
