import { type Role } from "../config.ts"

interface Data {
    user?: {
        email?: string
        password?: string
        pseudonyme?: string
        role?: Role
    }
    ressource?: {
        title?: string
        // A développer
    }
    tokens?: {
        accesToken?: string
        refreshToken?: string
    }
    error?: unknown
}

export const formatResponse = (message: string, data?: Data) => {
    return { message: message, data: data }
}
