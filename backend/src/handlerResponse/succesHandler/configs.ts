interface SuccesMapping {
    type: string
    msg: string
    statusCode: number
}
// Constants representing different types of successful events.
export const userCreated: string = "userCreated"
export const userDeleted: string = "userDeleted"
export const userUpdated: string = "userUpdated"
export const commentCreated: string = "commentCreated"
export const loginSucces: string = "loginSucces"
export const logoutSucces: string = "logoutSucces"
export const userFound: string = "userFound"
export const tokenRenewed: string = "tokenRenewed"
export const getResources: string = "getResources"
export const createResource: string = "createResource"
export const updateResource: string = "updateResource"
export const deleteResource: string = "deleteResource"

// Constants for the messages associated with success types.
export const msgUserCreated: string = "Utilisateur créé avec succès"
export const msgUserDeleted: string = "Utilisateur supprimé avec succès"
export const msgUserUpdated: string = "Utilisateur mis à jour avec succès"
export const msgCommentCreated: string = "Commentaire créé avec succès"
export const msgLoginSucces: string = "Connexion réussie"
export const msgLogoutSucces: string = "Utilisateur déconnecté avec succès"
export const msgUserFound: string = "Utilisateur trouvé"
export const msgTokenRenewed: string = "Nouveau token généré"
export const msgGetResources: string = "Ressources récupérées avec succès"
export const msgCreateResource: string = "Ressource créée avec succès"
export const msgUpdateResource: string = "Ressource mise à jour avec succès"
export const msgDeleteResource: string = "Ressource supprimée avec succès"

/**
 * Array of success mappings used to determine the HTTP status code based on the success type.
 * Each mapping includes a type, a message, and the corresponding HTTP status code.
 */
export const SuccesMappings: SuccesMapping[] = [
    { type: loginSucces, msg: msgLoginSucces, statusCode: 200 },
    { type: userFound, msg: msgUserFound, statusCode: 200 },
    { type: logoutSucces, msg: msgLogoutSucces, statusCode: 200 },
    { type: userDeleted, msg: msgUserDeleted, statusCode: 200 },
    { type: userUpdated, msg: msgUserUpdated, statusCode: 200 },
    { type: userCreated, msg: msgUserCreated, statusCode: 201 },
    { type: tokenRenewed, msg: msgTokenRenewed, statusCode: 201 },
    { type: commentCreated, msg: msgCommentCreated, statusCode: 201 },
    { type: getResources, msg: msgGetResources, statusCode: 200 },
    { type: createResource, msg: msgCreateResource, statusCode: 201 },
    { type: updateResource, msg: msgUpdateResource, statusCode: 200 },
    { type: deleteResource, msg: msgDeleteResource, statusCode: 200 },
]