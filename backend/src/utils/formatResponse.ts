import { type RessourceInterface } from "../interfaces/ressourceInterfaces.ts"
import { type UserInterface } from "../interfaces/userInterfaces.ts"
import { type TokensInterface } from "../interfaces/tokenInterfaces.ts"
/**
 * Interface representing the structure of the data that can be included in the response.
 */
interface Data {
    user?: UserInterface
    users?: UserInterface[]
    ressource?: RessourceInterface
    tokens?: TokensInterface
    error?: unknown
}
/**
 * Function to format a response with a message and optional data.
 *
 * This function takes a message and optional data, and returns an object
 * containing the message and data. The data can include user information,
 * a list of users, resource information, tokens, or an error.
 *
 */
export const formatResponse = (message: string, data?: Data) => {
    return { message: message, data: data }
}
