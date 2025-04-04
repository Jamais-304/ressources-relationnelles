import { type Request } from "express"
import { ROLE_HIERARCHY } from "../../configs.ts"
import { getCreatedFilter } from "./utils/createdFilter.ts"
import { getUpdatedFilter } from "./utils/updatedFilter.ts"
import { getRegexFilter } from "./utils/addRegexFilter.ts"
import { email, pseudonyme } from "../../handlerResponse/errorHandler/configs.ts"
/**
 * Builds a MongoDB query based on request parameters and user role
 *
 * @param req - The authenticated request object containing query parameters
 * @param userRoleIndex - The role index of the authenticated user (0 = super-admin, 1 = admin)
 * @returns MongoDB query object
 */

export interface QueryInterface {
    role?: { $ne?: string; $in?: string[] }
    email?: { $regex: string; $options: string }
    pseudonyme?: { $regex: string; $options: string }
    createdAt?: { $lte?: Date; $gte?: Date }
}

export const buildUserQuery = (req: Request, userRoleIndex: number): QueryInterface => {
    const query: QueryInterface = {}

    getRegexFilter(req, query, email as keyof QueryInterface)
    getRegexFilter(req, query, pseudonyme as keyof QueryInterface)
    if (req.query.role) {
        const requestedRoles: string[] = Array.isArray(req.query.role)
            ? (req.query.role as string[]) // Si plusieurs rôles sont envoyés
            : [req.query.role as string] // Si un seul rôle est envoyé
        // Super-administrateurs peuvent tout filtrer
        if (userRoleIndex === 0) {
            query.role = { $in: requestedRoles }
        }
        // Administrateurs peuvent filtrer, mais PAS sur "super-administrateur"
        else if (userRoleIndex === 1) {
            const filteredRoles = requestedRoles.filter((role) => role !== ROLE_HIERARCHY[0])
            query.role = filteredRoles.length > 0 ? { $ne: ROLE_HIERARCHY[0], $in: filteredRoles } : { $ne: ROLE_HIERARCHY[0] }
        }
    }

    getCreatedFilter(req, query)
    getUpdatedFilter(req, query)

    return query
}
