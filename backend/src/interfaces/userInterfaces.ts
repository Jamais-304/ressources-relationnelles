import { type Role } from "../configs.ts"

export interface UserInterface {
    email?: string
    password?: string
    pseudonyme: string
    role?: Role
    createdAt?: Date
    updatedAt?: Date
}

export interface UserReqBodyRequest extends UserInterface {
    id?: string
    userId?: string
    uuid?: string
    _id?: string
    newPassword?: string
}
