import { ROLE_HIERARCHY } from "../../../config.ts"
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

export const signUpUserValidationRules = [
    ...commonEmailValidation(),
    ...commonPasswordValidation(),
    ...commonPseudonymValidation(),
    ...commonRoleValidation([ROLE_HIERARCHY[3]]) // Utilisateur
]

export const adminCreateUserValidationRules = [
    ...commonEmailValidation(),
    ...commonPasswordValidation(),
    ...commonPseudonymValidation(),
    ...commonRoleValidation(ROLE_HIERARCHY)
]

export const loginUserValidationRules = [...commonEmailValidation(), ...commonPasswordValidation()]

export const updateUserValidationRules = [
    ...commonOptionalEmailValidation(),
    ...commonOptionalNewPasswordValidation(),
    ...commonOptionalPasswordValidation(),
    ...commonOptionalPseudonymeValidation(),
    ...commonOptionalRoleValidation(ROLE_HIERARCHY)
]
