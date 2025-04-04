import dotenv from "dotenv"

dotenv.config() // Load variables .env

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue
    if (!value) throw new Error(`Missing env variable: ${key}`)
    return value
}

export const MONGO_URI = getEnv("MONGO_URI")
export const PORT_BACKEND = getEnv("PORT_BACKEND", "3000")

export const ROLES = {
    SUPER_ADMIN: "super-administrateur",
    ADMIN: "administrateur",
    MODERATOR: "moderateur",
    USER: "utilisateur"
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_HIERARCHY = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]

// Configs validator or response values

export const uuidMaxLength: number = 35
export const passwordMinLength: number = 8
export const passwordMaxLength: number = 90
export const pseudonymeMinLength: number = 5
export const pseudonymeMaxLength: number = 50
export const expireRefreshToken: string = "7d"