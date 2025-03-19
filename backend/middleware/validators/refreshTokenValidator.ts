// Import the body object from express-validator
import { body } from "express-validator"

// Validation rule for the refresh token
export const refreshTokenValidationRule = [
    body("refreshToken").isString().withMessage("Refresh token must be a string").escape().trim() // Remove leading and trailing spaces
]
