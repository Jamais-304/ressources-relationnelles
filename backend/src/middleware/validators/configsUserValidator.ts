import { body } from "express-validator"

export const commonEmailValidation = () => [
    body("email")
    .exists()
    .isEmail()
    .withMessage("Email must be a valid email address")
    .normalizeEmail()
    .escape()
    .trim()
]
export const commonPasswordValidation = () => [
    body("password")
        .exists()
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters and less than 50 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .escape()
        .trim()
]
export const commonPseudonymValidation = () => [
        body("pseudonyme")
        .exists()
        .isString()
        .withMessage("Pseudonym must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim()
]
export const commonRoleValidation = (roles: string[]) => [
    body("role")
    .exists()
    .isString()
    .withMessage("Role must be a string")
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isIn(roles)
    .withMessage(`Role must be one of the following: ${roles.join(", ")}`)
    .escape()
    .trim()
]
// Optional
export const commonOptionalPasswordValidation = () => [
    body("password")
        .optional()
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters and less than 50 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .escape()
        .trim()
]
export const commonOptionalNewPasswordValidation = () => [
    body("password")
        .optional()
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .isLength({ min: 8, max: 50 })
        .withMessage("Password must be at least 8 characters and less than 50 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .escape()
        .trim()
]
export const commonOptionalPseudonymeValidation = () => [
    body("pseudonyme")
        .optional()
        .isString()
        .withMessage("Pseudonym must be a string")
        .isLength({ min: 5, max: 40 })
        .withMessage("Pseudonym must be at least 5 characters and less than 40 characters")
        .escape()
        .trim()
]
export const commonOptionalRoleValidation = (roles: string[]) => [
    body("role")
        .optional()
        .isString()
        .withMessage("Role must be a string")
        .isIn(roles)
        .withMessage(`Role must be one of the following: ${roles.join(", ")}`)
        .escape()
        .trim()
]
export const commonOptionalEmailValidation = () => [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email must be a valid email address")
        .normalizeEmail()
        .escape()
        .trim(),
]
