import request from "supertest"
import bcrypt from "bcrypt"
import app from "../../app.ts"
import User from "../../models/User.ts"
import { generateAccesToken, generateRefreshToken } from "../../utils/generateTokens.ts"

jest.mock("bcrypt")
jest.mock("../../models/User.ts")
jest.mock("../../utils/generateTokens.ts", () => ({
    generateAccesToken: jest.fn(),
    generateRefreshToken: jest.fn()
}))

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
})

const accessToken = "accessToken"
const refreshToken = "refreshToken"
const newUser = {
    email: "test@test.com",
    password: "testtest",
    pseudonyme: "usertest"
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
