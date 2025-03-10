import {type Role } from "../config.ts"

export interface UserInterface {
    _id?: string
    email?: string
    password?: string
    pseudonyme: string
    role?: Role
    createdAt?: Date
    updatedAt?: Date
}
