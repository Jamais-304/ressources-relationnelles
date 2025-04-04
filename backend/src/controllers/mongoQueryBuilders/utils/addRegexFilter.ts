import { type QueryInterface } from "../queryUserBuilder.ts"
import { type Request } from "express"

export const getRegexFilter = (req: Request, query: QueryInterface, field: keyof QueryInterface): void => {
    if (req.query[field]) {
        query[field] = { $regex: req.query[field] as string, $options: "i" }
    }
}
