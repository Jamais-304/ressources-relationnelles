interface ErrorMapping {
    type: string
    msg: string
    statusCode: number
    location?: string
}

export const unexpectedError: string = "unexpectedErr"
export const serverError: string = "serverErr"
export const invRole: string = "invRole"
export const missingInfo: string = "missingInfo"
export const noConditions: string = "noConditions"
export const roleUnavailable: string = "roleUnvailable"
export const noFields: string = "noFields"
export const refreshTokenRequired: string = "refreshTokenRequierd"
export const noPasswordSet: string = "noPasswordSet"
export const newPasswordRequired: string = "newPasswordRequired"
export const passwordRequired: string = "passwordRequired"
export const unauthorized: string = "unauthorized"
export const incorrectPassword: string = "incorrectPassword"
export const invalidCredentials: string = "invalidCredentials"
export const insufficientAccess: string = "insufficientAccess"
export const invalidToken: string = "invalidToken"
export const expiredToken: string = "expiredToken"
export const userNotFound: string = "userNotFound"
export const unableInfo: string = "unableInfo"
export const invToken: string = "invToken"
export const expirToken: string = "expirToken"
export const msgInvalidCredentials: string = "Identifiant/mot de passe incorrect !"
export const msgServerError: string = "Erreur serveur"

/**
 * Array of error mappings used to determine the HTTP status code based on the error type.
 */
export const ErrorMappings: ErrorMapping[] = [
    { type: invRole, msg: "Rôle invalide", statusCode: 400, location: "body" },
    { type: missingInfo, msg: "Informations manquantes", statusCode: 400, location: "body" },
    { type: noConditions, msg: "Aucune condition remplie", statusCode: 400 },
    { type: roleUnavailable, msg: "Le rôle est indisponible", statusCode: 400 },
    { type: noFields, msg: "Aucun champ fourni pour la mise à jour", statusCode: 400 },
    { type: refreshTokenRequired, msg: "Le jeton de rafraîchissement est requis", statusCode: 400 },
    { type: noPasswordSet, msg: "Aucun mot de passe défini pour ce compte. La mise à jour du mot de passe est impossible", statusCode: 400 },
    { type: newPasswordRequired, msg: "'newPassword' est requis pour mettre à jour le mot de passe", statusCode: 400 },
    { type: passwordRequired, msg: "'password' est requis pour confirmer votre identité avant modification", statusCode: 400 },
    { type: unauthorized, msg: "Accès non autorisé", statusCode: 401 },
    { type: invToken, msg: "Token invalid", statusCode: 401 },
    { type: expirToken, msg: "Token invalid", statusCode: 401 },
    { type: incorrectPassword, msg: "Mot de passe incorrect. Veuillez réessayer", statusCode: 401 },
    { type: invalidCredentials, msg: msgInvalidCredentials, statusCode: 401, location: "body" },
    { type: insufficientAccess, msg: "Accès insuffisant", statusCode: 403 },
    { type: invalidToken, msg: "Jeton invalide", statusCode: 403, location: "body" },
    { type: expiredToken, msg: "Le jeton de rafraîchissement a expiré", statusCode: 403 },
    { type: userNotFound, msg: "Utilisateur non trouvé. Veuillez vérifier l'email fourni", statusCode: 404 },
    { type: unableInfo, msg: "Impossible de créer un compte avec les informations fournies", statusCode: 409 },
    { type: serverError, msg: msgServerError, statusCode: 500 },
    { type: unexpectedError, msg: "Une erreur inattendue s'est produite", statusCode: 500 }
]
