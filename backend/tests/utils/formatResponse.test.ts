import { formatResponse} from "../../utils/formatResponse.ts"
import { type TokensInterface } from "../../interfaces/tokenInterfaces.ts"

describe("formatResponse", () => {
    it("should return a response with a message and no data", () => {
        const message = "Success"
        const response = formatResponse(message)
        expect(response).toEqual({ message, data: undefined })
    })

    it("should return a response with a message and user data", () => {
        const message = "User found"
        const user = { _id: 1, email: "test@test.com", pseudonyme: "toto" }
        const response = formatResponse(message, { user })
        expect(response).toEqual({ message, data: { user } })
    })

    it("should return a response with a message and users data", () => {
        const message = "Users found"
        const users = [
            { _id: 1, email: "test@test.com", pseudonyme: "toto" },
            { _id: 2, email: "test@test.com", pseudonyme: "toto" }
        ]
        const response = formatResponse(message, { users })
        expect(response).toEqual({ message, data: { users } })
    })

    it("should return a response with a message and tokens data", () => {
        const message = "Tokens found"
        const tokens: TokensInterface = { accessToken: "abc123", refreshToken: "def456" }
        const response = formatResponse(message, { tokens })
        expect(response).toEqual({ message, data: { tokens } })
    })

    it("should return a response with a message and error data", () => {
        const message = "Error occurred"
        const error = new Error("Something went wrong")
        const response = formatResponse(message, { error })
        expect(response).toEqual({ message, data: { error } })
    })

    it("should return a response with a message, user and token", () => {
        const message = "Complex response"
        const user = { _id: 1, name: "John Doe", pseudonyme: "toto" }
        const tokens: TokensInterface = { accessToken: "abc123", refreshToken: "def456" }
        const response = formatResponse(message, { user, tokens })
        expect(response).toEqual({ message, data: { user, tokens } })
    })
})