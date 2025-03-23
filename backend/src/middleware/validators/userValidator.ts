// Import the body object from express-validator
import { body } from "express-validator"

// Validation rules for user sign-up
export const signUpUserValidationRules = [
    // Email: must be a valid email, escape special characters
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Password: string, required, escape special characters
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be at least 8 characters and less than 26 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Pseudonym: string, required, escape special characters
    body("pseudonyme")
        .isString()
        .withMessage("Pseudonym must be a string")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim() // Remove leading and trailing spaces
]

// Validation rules for user login
export const loginUserValidationRules = [
    // Email: must be a valid email, escape special characters
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Password: string, required, escape special characters
    body("password")
        .isString()
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be at least 8 characters and less than 26 characters")
        .escape()
        .trim()
]

// Validation rules for updating user information
export const updateUserValidationRules = [...signUpUserValidationRules]
