import { type UserInterface } from "../interfaces/userInterfaces.ts"
import { type Role } from "../config.ts"

export interface TokensInterface {
    accessToken?: string
    refreshToken?: string
}

export interface DecodedToken {
    userId: string
    role: Role
}

export interface IUserToken extends Pick<UserInterface, "role"> {
    _id: string
}