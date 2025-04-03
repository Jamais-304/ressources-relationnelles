import { body } from "express-validator"
import {
    userMsgEmailInvalid,
    userMsgPasswordRequirements,
    userMsgLength,
    userMsgCannotBeEmpty,
    userMsgMustBeString,
    userMsgRoleInvalid
} from "../../handlerResponse/errorHandler/configs.ts"

const password = "mot de passe"
const pseudonyme = "pseudonyme"
const email = "email"
const role = "role"
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&,]{8,50}$/

export const commonEmailValidation = () => [
    body("email").exists().withMessage(userMsgCannotBeEmpty(email)).isEmail().withMessage(userMsgEmailInvalid).normalizeEmail().escape().trim()
]
export const commonPasswordValidation = () => [
    body("password")
        .exists()
        .withMessage(userMsgCannotBeEmpty(password))
        .isString()
        .withMessage(userMsgMustBeString(password))
        .isLength({ min: 8, max: 50 })
        .withMessage(userMsgLength(password, 8, 50))
        .matches(passwordRegex)
        .withMessage(userMsgPasswordRequirements)
        .escape()
        .trim()
]
export const commonPseudonymValidation = () => [
    body("pseudonyme")
        .exists()
        .withMessage(userMsgCannotBeEmpty(pseudonyme))
        .isString()
        .withMessage(userMsgMustBeString(pseudonyme))
        .isLength({ min: 5, max: 40 })
        .withMessage(userMsgLength(pseudonyme, 5, 40))
        .escape()
        .trim()
]
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
// Optional
export const commonOptionalPasswordValidation = () => [
    body("password")
        .optional()
        .isString()
        .withMessage(userMsgMustBeString(password))
        .isLength({ min: 8, max: 50 })
        .withMessage(userMsgLength(password, 8, 50))
        .matches(passwordRegex)
        .withMessage(userMsgPasswordRequirements)
        .escape()
        .trim()
]

export const commonOptionalNewPasswordValidation = commonOptionalPasswordValidation

export const commonOptionalPseudonymeValidation = () => [
    body("pseudonyme")
        .optional()
        .isString()
        .withMessage(userMsgMustBeString(pseudonyme))
        .isLength({ min: 5, max: 40 })
        .withMessage(userMsgLength(pseudonyme, 5, 40))
        .escape()
        .trim()
]
export const commonOptionalRoleValidation = (roles: string[]) => [
    body("role").optional().isString().withMessage(userMsgMustBeString(role)).isIn(roles).withMessage(userMsgRoleInvalid(roles)).escape().trim()
]
export const commonOptionalEmailValidation = () => [body("email").optional().isEmail().withMessage(userMsgEmailInvalid).normalizeEmail().escape().trim()]
