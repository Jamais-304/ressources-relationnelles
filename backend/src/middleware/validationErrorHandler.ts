import type { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { errorResponse } from "../utils/formatResponse.ts"


export const validationErrorHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        res.status(400).json(errorResponse({errors : error.array()}))
        return
    }
    next()
}
