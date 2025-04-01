// Import the body object from express-validator
import { body } from "express-validator"

// Validation rules for user sign-up
export const signUpUserValidationRules = [
    // Email: must be a valid email, escape special characters
    body("email")
        .exists()
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Password: string, required, escape special characters
    body("password")
        .exists()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters and less than 50 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Pseudonym: string, required, escape special characters
    body("pseudonyme")
        .exists()
        .isString()
        .withMessage("Pseudonym must be a string")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Role: string, required, equals escape special characters
    body("role").isString().withMessage("Role must be a string").equals("utilisateur").withMessage("Invalid role").escape().trim() // Remove leading and trailing spaces
]
// Validation rules for user sign-up
export const adminCreateUserValidationRules = [
    // Email: must be a valid email, escape special characters
    body("email")
        .exists()
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Password: string, required, escape special characters
    body("password")
        .exists()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters and less than 50 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Pseudonym: string, required, escape special characters
    body("pseudonyme")
        .exists()
        .isString()
        .withMessage("Pseudonym must be a string")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Role: string, required, escape special characters
    body("role")
        .exists()
        .isString()
        .withMessage("Role must be a string")
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
        .exists()
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Password: string, required, escape special characters
    body("password")
        .exists()
        .isString()
        .isLength({ min: 8, max: 25 })
        .withMessage("Password must be at least 8 characters and less than 26 characters")
        .escape()
        .trim()
]

// Validation rules for updating user information
export const updateUserValidationRules = [
    // Email: must be a valid email, escape special characters
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail() // Normalize the email
        .escape()
        .trim(), // Remove leading and trailing spaces

    // // Password: string, required, escape special characters
    // body("newPassword")
    //     .optional()
    //     .isString()
    //     .withMessage("Password must be a string")
    //     .isLength({ min: 8, max: 50 })
    //     .withMessage("Password must be at least 8 characters and less than 50 characters")
    //     .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
    //     .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    //     .escape()
    //     .trim(), // Remove leading and trailing spaces

    // Password: string, required, escape special characters
    body("password")
        .optional()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters and less than 50 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Pseudonym: string, required, escape special characters
    body("pseudonyme")
        .optional()
        .isString()
        .withMessage("Pseudonym must be a string")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim(), // Remove leading and trailing spaces

    // Role: string, required, equals escape special characters
    body("role").optional().isString().withMessage("Role must be a string").equals("utilisateur").withMessage("Invalid role").escape().trim() // Remove leading and trailing spaces
]
