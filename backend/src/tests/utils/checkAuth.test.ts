import { checkAuthentification, checkUserRole, checkUserParams } from "../../utils/checkAuth"
import User from "../../models/User.ts"
import { AuthRequest } from "../../interfaces/authInterface.ts"
import { Role, ROLE_HIERARCHY } from "../../configs.ts"
import { unauthorized, invRole, missingInfo } from "../../handlerResponse/errorHandler/configs.ts"

jest.mock("../../models/User.ts")

describe("checkAuthentification", () => {
    it("should throw an error if req.auth is not present", async () => {
        const req = {} as AuthRequest
        await expect(checkAuthentification(req)).rejects.toThrow(unauthorized)
    })
    it("should throw an error if req.auth.userId is not present", async () => {
        const req = {} as AuthRequest
        await expect(checkAuthentification(req)).rejects.toThrow(unauthorized)
    })
    it("should return the user if authentication is successful", async () => {
        ;(User.findById as jest.Mock).mockResolvedValue({ _id: "123", name: "Test User" })
        const req = { auth: { userId: "123" } } as AuthRequest
        const user = await checkAuthentification(req)
        expect(user).toEqual({ _id: "123", name: "Test User" })
        expect(User.findById).toHaveBeenCalledWith("123")
    })
    it("should return null if user is not found", async () => {
        ;(User.findById as jest.Mock).mockResolvedValue(null)

        const req = { auth: { userId: "123" } } as AuthRequest
        const user = await checkAuthentification(req)
        expect(user).toBeNull()
        expect(User.findById).toHaveBeenCalledWith("123")
    })
})

describe("checkUserRole", () => {
    it("should return the correct index for utilisateur role", () => {
        const valideRole: Role = "utilisateur"
        const expectedIndex = ROLE_HIERARCHY.indexOf(valideRole)
        expect(checkUserRole(valideRole)).toBe(expectedIndex)
    })
    it("should return the correct index for moderateur role", () => {
        const valideRole: Role = "moderateur"
        const expectedIndex = ROLE_HIERARCHY.indexOf(valideRole)
        expect(checkUserRole(valideRole)).toBe(expectedIndex)
    })
    it("should return the correct index for administrateur role", () => {
        const valideRole: Role = "administrateur"
        const expectedIndex = ROLE_HIERARCHY.indexOf(valideRole)
        expect(checkUserRole(valideRole)).toBe(expectedIndex)
    })
    it("should return the correct index for super-administrateur role", () => {
        const valideRole: Role = "super-administrateur"
        const expectedIndex = ROLE_HIERARCHY.indexOf(valideRole)
        expect(checkUserRole(valideRole)).toBe(expectedIndex)
    })
    it("should thorw and error if userRoleIndex is equal to -1", () => {
        const invalideRole = "user-role-test" as Role
        expect(() => checkUserRole(invalideRole)).toThrow(invRole)
    })
})
describe("checkUserRole", () => {
    it("should throw an error if userParams is not present", async () => {
        ;(User.findById as jest.Mock).mockResolvedValue(null)
        const userParamsId = "22qef5"
        await expect(checkUserParams(userParamsId)).rejects.toThrow(missingInfo)
        expect(User.findById).toHaveBeenCalledWith("22qef5")
    })
    it("should throw an error if !userParams.role is not present", async () => {
        ;(User.findById as jest.Mock).mockResolvedValue(null)
        const userParamsId = ""
        await expect(checkUserParams(userParamsId)).rejects.toThrow(missingInfo)
        expect(User.findById).toHaveBeenCalledWith("")
    })
    it("should return the correct role index if userParams and userParams.role are present", async () => {
        const mockUser = { role: "super-administrateur" }
        ;(User.findById as jest.Mock).mockResolvedValue(mockUser)
        const userParamsId = "22qef5"
        const roleIndex = await checkUserParams(userParamsId)
        expect(roleIndex).toBe(ROLE_HIERARCHY.indexOf("super-administrateur"))
        expect(User.findById).toHaveBeenCalledWith("22qef5")
    })
})
