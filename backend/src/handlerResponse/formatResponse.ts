import type { ResourceInterface } from "../interfaces/resourceInterface.ts"
import { type UserInterface } from "../interfaces/userInterfaces.ts"
import { type TokensInterface } from "../interfaces/tokenInterfaces.ts"
import { type PaginationInterface } from "../interfaces/paginationInterface.ts"
import { type CommentsInterface } from "../interfaces/commentsInterface.ts"
import { type CategoryInterface } from "../interfaces/categoryInterface.ts"
/**
 * Interface representing the structure of the data that can be included in the response.
 */
export interface Data {
    user?: UserInterface
    users?: UserInterface[]
    ressource?: ResourceInterface | ResourceInterface[]
    category?: CategoryInterface | CategoryInterface[]
    tokens?: TokensInterface
    pagination?: PaginationInterface
    comments?: CommentsInterface
    [key: string]: unknown // Permet des propriétés supplémentaires flexibles
}

interface ErrorDataItem {
    location?: string
    msg?: string
    path?: string
    type?: string
    errors?: unknown
}

type ErrorData = ErrorDataItem | ErrorDataItem[]
/**
 * Function to format a response with a message and optional data.
 *
 * This function takes a message and optional data, and returns an object
 * containing the message and data. The data can include user information,
 * a list of users, resource information, tokens, or an error.
 *
 */
export const dataResponse = (message: string, data?: Data) => {
    return { message: message, data: data }
}

export const errorResponse = (error: ErrorData) => {
    return { error: error }
}
