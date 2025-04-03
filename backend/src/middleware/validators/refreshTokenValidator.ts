import { body } from "express-validator"
import {tokenMsgMustBeString} from "../../handlerResponse/errorHandler/configs.ts"
/**
 * Validation rule for the 'refreshToken' field in the request body.
 * Ensures that the refresh token is a string and applies necessary sanitization.
 * 
 * - The 'isString' method ensures the 'refreshToken' field is a string.
 * - The 'withMessage' method sets a custom error message if the validation fails.
 * - The 'escape' method removes any HTML characters that could be used for injection attacks.
 * - The 'trim' method removes any leading or trailing spaces from the string.
 * 
 * @returns An array containing the validation chain for 'refreshToken'
 */
export const refreshTokenValidationRule = [
    body("refreshToken").isString().withMessage(tokenMsgMustBeString("Refresh token")).escape().trim()
]
