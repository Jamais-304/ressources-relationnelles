// Import the body object from express-validator
import { body } from "express-validator"
import User from "../../models/User.ts"

// Validation rules for user sign-up
export const signUpUserValidationRules = [
    // Email: must be a valid email, escape special characters
    body("email")
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim() // Remove leading and trailing spaces
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value })
            if (existingUser) {
                throw new Error("Email must be unique")
            }
            return true
        }),

    // Password: string, required, escape special characters
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be at least 8 characters and less than 26 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Pseudonym: string, required, escape special characters
    body("pseudonyme")
        .isString()
        .withMessage("Pseudonym must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Role: string, required, equals escape special characters
    body("role")
        .isString()
        .withMessage("Role must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .equals("utilisateur")
        .withMessage("Invalid role")
        .escape()
        .trim() // Remove leading and trailing spaces
]
// Validation rules for user sign-up
export const adminCreateUserValidationRules = [
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
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be at least 8 characters and less than 26 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Pseudonym: string, required, escape special characters
    body("pseudonyme")
        .isString()
        .withMessage("Pseudonym must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Role: string, required, escape special characters
    body("role")
        .isString()
        .withMessage("Role must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 10, max: 20 })
        .withMessage("Role must be at least 10 characters and less than 20 characters")
        .isIn(["utilisateur", "moderateur", "super-administrateur", "administrateur"])
        .withMessage("Role must be one of the following: utilisateur, moderateur, super-administrateur, administrateur")
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
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be at least 8 characters and less than 26 characters")
        .escape()
        .trim()
]

// Validation rules for updating user information
export const updateUserValidationRules = [...signUpUserValidationRules]
