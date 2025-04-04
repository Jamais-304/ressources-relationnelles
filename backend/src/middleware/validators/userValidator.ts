import { ROLE_HIERARCHY } from "../../configs.ts"
import {
    commonEmailValidation,
    commonPasswordValidation,
    commonPseudonymValidation,
    commonRoleValidation,
    commonOptionalEmailValidation,
    commonOptionalNewPasswordValidation,
    commonOptionalPasswordValidation,
    commonOptionalPseudonymeValidation,
    commonOptionalRoleValidation
} from "./configsUserValidator.ts"

/**
 * Validation rules for user registration (sign up).
 * These rules validate the required fields for creating a new user.
 * 
 * @returns An array of validation rules for the 'email', 'password', 'pseudonyme', and 'role' fields.
 */
export const signUpUserValidationRules = [
    ...commonEmailValidation(),
    ...commonPasswordValidation(),
    ...commonPseudonymValidation(),
    ...commonRoleValidation([ROLE_HIERARCHY[3]]) // Utilisateur
]
/**
 * Validation rules for creating a new user by an admin.
 * These rules validate the required fields when an admin creates a new user.
 * 
 * @returns An array of validation rules for the 'email', 'password', 'pseudonyme', and 'role' fields.
 */
export const adminCreateUserValidationRules = [
    ...commonEmailValidation(),
    ...commonPasswordValidation(),
    ...commonPseudonymValidation(),
    ...commonRoleValidation(ROLE_HIERARCHY)
]/**
 * Validation rules for user login.
 * These rules validate the 'email' and 'password' fields required for logging in.
 * 
 * @returns An array of validation rules for the 'email' and 'password' fields.
 */
export const loginUserValidationRules = [...commonEmailValidation(), ...commonPasswordValidation()]
/**
 * Validation rules for updating user information.
 * These rules allow optional updates to the 'email', 'password', 'pseudonyme', and 'role' fields.
 * 
 * @returns An array of validation rules for the 'email', 'password', 'pseudonyme', and 'role' fields.
 */
export const updateUserValidationRules = [
    ...commonOptionalEmailValidation(),
    ...commonOptionalNewPasswordValidation(),
    ...commonOptionalPasswordValidation(),
    ...commonOptionalPseudonymeValidation(),
    ...commonOptionalRoleValidation(ROLE_HIERARCHY)
]
