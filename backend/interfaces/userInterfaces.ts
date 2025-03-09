import {type Role } from "../config.ts"

export interface UserInterface {
    email: string
    password: string
    pseudonyme: string
    role?: Role
}
