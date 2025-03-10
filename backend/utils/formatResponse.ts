import { type RessourceInterface } from "../interfaces/ressourceInterfaces.ts"
import { type UserInterface } from "../interfaces/userInterfaces.ts"
import { type TokensInterface } from "../interfaces/tokenInterfaces.ts"

interface Data {
    user?: UserInterface
    users?: UserInterface[]
    ressource?: RessourceInterface
    tokens?: TokensInterface
    error?: unknown
}

export const formatResponse = (message: string, data?: Data) => {
    return { message: message, data: data }
}
