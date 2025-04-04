import { body } from "express-validator"
import {
    userMsgEmailInvalid,
    userMsgPasswordRequirements,
    userMsgLength,
    userMsgCannotBeEmpty,
    userMsgMustBeString,
    userMsgRoleInvalid,
    password,
    pseudonyme,
    email,
    role
} from "../../handlerResponse/errorHandler/configs.ts"
import { passwordMaxLength, passwordMinLength, pseudonymeMinLength, pseudonymeMaxLength } from "../../configs.ts"
// Regular expression for validating password (at least one uppercase, one lowercase, one number, one special character, 8-50 characters)

const passwordRegex = new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{${passwordMinLength},${passwordMaxLength}}$`)

/**
 * Validates the email field, checking if it exists, is a valid email, and normalizes/escapes it.
 * @returns Array of express-validator chain methods for email validation
 */
export const commonEmailValidation = () => [
    body("email").exists().withMessage(userMsgCannotBeEmpty(email)).isEmail().withMessage(userMsgEmailInvalid).normalizeEmail().escape().trim()
]
/**
 * Validates the password field, checking if it exists, is a string, has the correct length, matches the required regex, and escapes/normalizes it.
 * @returns Array of express-validator chain methods for password validation
 */
export const commonPasswordValidation = () => [
    body("password")
        .exists()
        .withMessage(userMsgCannotBeEmpty(password))
        .isString()
        .withMessage(userMsgMustBeString(password))
        .isLength({ min: passwordMinLength, max: passwordMaxLength })
        .withMessage(userMsgLength(password, passwordMinLength, passwordMaxLength))
        .matches(passwordRegex)
        .withMessage(userMsgPasswordRequirements)
        .escape()
        .trim()
]
/**
 * Validates the pseudonym field, checking if it exists, is a string, has the correct length, and escapes/normalizes it.
 * @returns Array of express-validator chain methods for pseudonym validation
 */
export const commonPseudonymValidation = () => [
    body("pseudonyme")
        .exists()
        .withMessage(userMsgCannotBeEmpty(pseudonyme))
        .isString()
        .withMessage(userMsgMustBeString(pseudonyme))
        .isLength({ min: pseudonymeMinLength, max: pseudonymeMaxLength })
        .withMessage(userMsgLength(pseudonyme, pseudonymeMinLength, pseudonymeMaxLength))
        .escape()
        .trim()
]
/**
 * Validates the role field, checking if it exists, is a string, belongs to the allowed roles, and escapes/normalizes it.
 * @param roles Array of allowed roles to check against
 * @returns Array of express-validator chain methods for role validation
 */
export const commonRoleValidation = (roles: string[]) => [
    body("role")
        .exists()
        .withMessage(userMsgCannotBeEmpty(role))
        .isString()
        .withMessage(userMsgMustBeString(role))
        .isIn(roles)
        .withMessage(userMsgRoleInvalid(roles))
        .escape()
        .trim()
]

// Optional Validations
/**
 * Validates the password field (optional), allowing for updates where password validation is not required.
 * @returns Array of express-validator chain methods for optional password validation
 */
export const commonOptionalPasswordValidation = () => [
    body("password")
        .optional()
        .isString()
        .withMessage(userMsgMustBeString(password))
        .isLength({ min: passwordMinLength, max: passwordMaxLength })
        .withMessage(userMsgLength(password, passwordMinLength, passwordMaxLength))
        .matches(passwordRegex)
        .withMessage(userMsgPasswordRequirements)
        .escape()
        .trim()
]
/**
 * Validates the new password field (optional), reusing the common password validation rules.
 * @returns Array of express-validator chain methods for optional new password validation
 */
export const commonOptionalNewPasswordValidation = commonOptionalPasswordValidation
/**
 * Validates the pseudonym field (optional), allowing for updates where pseudonym validation is not required.
 * @returns Array of express-validator chain methods for optional pseudonym validation
 */
export const commonOptionalPseudonymeValidation = () => [
    body("pseudonyme")
        .optional()
        .isString()
        .withMessage(userMsgMustBeString(pseudonyme))
        .isLength({ min: pseudonymeMinLength, max: pseudonymeMaxLength })
        .withMessage(userMsgLength(pseudonyme, pseudonymeMinLength, pseudonymeMaxLength))
        .escape()
        .trim()
]
/**
 * Validates the role field (optional), allowing for updates where role validation is not required.
 * @param roles Array of allowed roles to check against
 * @returns Array of express-validator chain methods for optional role validation
 */
export const commonOptionalRoleValidation = (roles: string[]) => [
    body("role").optional().isString().withMessage(userMsgMustBeString(role)).isIn(roles).withMessage(userMsgRoleInvalid(roles)).escape().trim()
]
/**
 * Validates the email field (optional), allowing for updates where email validation is not required.
 * @returns Array of express-validator chain methods for optional email validation
 */
export const commonOptionalEmailValidation = () => [
    body("email").optional().isEmail().withMessage(userMsgEmailInvalid).normalizeEmail().escape().trim()
]
