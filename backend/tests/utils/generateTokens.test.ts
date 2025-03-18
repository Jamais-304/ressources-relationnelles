import { generateAccesToken, generateRefreshToken } from "../../utils/generateTokens"
import jwt from "jsonwebtoken"
import RefreshToken from "../../models/RefreshToken"
import { IUserToken } from "../../interfaces/tokenInterfaces"

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("mocked-token")
}))
jest.mock("../../models/RefreshToken")

describe("generateAccesToken", () => {
    const user = { _id: "123", pseudonyme: "toto", role: "utilisateur" } as IUserToken

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should generate an access token", () => {
        process.env.TOKEN_SECRET = "secret"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const signMock = jest.spyOn(jwt, "sign" as any).mockReturnValue("mocked-token")

        const token = generateAccesToken(user)

        expect(signMock).toHaveBeenCalledWith({ userId: user._id, role: user.role }, "secret", { expiresIn: "15m" })
        expect(token).toBe("mocked-token")
    })

    it("should return undefined if secret key is not defined", () => {
        delete process.env.TOKEN_SECRET

        const token = generateAccesToken(user)

        expect(token).toBeUndefined()
    })
})

describe("generateRefreshToken", () => {
    const user = { _id: "123", pseudonyme: "toto", role: "utilisateur" } as IUserToken

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should generate a refresh token and store it in the database", async () => {
        process.env.TOKEN_SECRET = "secret"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const signMock = jest.spyOn(jwt, "sign" as any).mockReturnValue("mocked-token")

        const mockDocument = {
            _id: "mocked-id",
            refreshToken: "mocked-token",
            userId: user._id,
            createdAt: new Date()
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createMock = jest.spyOn(RefreshToken, "create" as any).mockResolvedValue(mockDocument)

        const token = await generateRefreshToken(user)

        expect(signMock).toHaveBeenCalledWith({ userId: user._id, role: user.role }, "secret", { expiresIn: "7d" })
        expect(createMock).toHaveBeenCalledWith({ refreshToken: "mocked-token", userId: user._id })
        expect(token).toBe("mocked-token")
    })

    it("should return undefined if secret key is not defined", async () => {
        delete process.env.TOKEN_SECRET

        const token = await generateRefreshToken(user)

        expect(token).toBeUndefined()
    })
})