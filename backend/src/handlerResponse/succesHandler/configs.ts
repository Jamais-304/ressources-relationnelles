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
export const commentUpdated: string = "commentUpdated"
export const commentDeleted: string = "commentDeleted"
export const commentsFound: string = "commentsFound"
export const loginSucces: string = "loginSucces"
export const logoutSucces: string = "logoutSucces"
export const userFound: string = "userFound"
export const usersFound: string = "usersFound"
export const tokenRenewed: string = "tokenRenewed"
export const noUser: string = "noUser"
export const getResources: string = "getResources"
export const createResource: string = "createResource"
export const updateResource: string = "updateResource"
export const deleteResource: string = "deleteResource"
export const getCategories: string = "getCategories"
export const createCategorySuccess: string = "createCategorySuccess"
export const updateCategorySuccess: string = "updateCategorySuccess"
export const deleteCategorySuccess: string = "deleteCategorySuccess"

// Constants for the messages associated with success types.
export const msgUserCreated: string = "Utilisateur créé avec succès"
export const msgUserDeleted: string = "Utilisateur supprimé avec succès"
export const msgUserUpdated: string = "Utilisateur mis à jour avec succès"
export const msgCommentCreated: string = "Commentaire créé avec succès"
export const msgCommentUpdated: string = "Commentaire mis à jour avec succès"
export const msgCommentDeleted: string = "Commentaire supprimé avec succès"
export const msgCommentFound: string = "Commentaire trouvé"
export const msgCommentsFound: string = "Commentaires trouvés"
export const msgLoginSucces: string = "Connexion réussie"
export const msgLogoutSucces: string = "Utilisateur déconnecté avec succès"
export const msgUserFound: string = "Utilisateur trouvé"
export const msgUsersFound: string = "Utilisateurs trouvés"
export const msgTokenRenewed: string = "Nouveau token généré"
export const msgNoUser: string = "Aucun utilisateur trouvé"
export const msgGetResources: string = "Ressources récupérées avec succès"
export const msgCreateResource: string = "Ressource créée avec succès"
export const msgUpdateResource: string = "Ressource mise à jour avec succès"
export const msgDeleteResource: string = "Ressource supprimée avec succès"
export const msgGetCategories: string = "Catégories récupérées avec succès"
export const msgCreateCategory: string = "Catégorie créée avec succès"
export const msgUpdateCategory: string = "Catégorie mise à jour avec succès"
export const msgDeleteCategory: string = "Catégorie supprimée avec succès"

/**
 * Array of success mappings used to determine the HTTP status code based on the success type.
 * Each mapping includes a type, a message, and the corresponding HTTP status code.
 */
export const SuccesMappings: SuccesMapping[] = [
    { type: loginSucces, msg: msgLoginSucces, statusCode: 200 },
    { type: noUser, msg: msgNoUser, statusCode: 200 },
    { type: userFound, msg: msgUserFound, statusCode: 200 },
    { type: usersFound, msg: msgUsersFound, statusCode: 200 },
    { type: logoutSucces, msg: msgLogoutSucces, statusCode: 200 },
    { type: userDeleted, msg: msgUserDeleted, statusCode: 200 },
    { type: userUpdated, msg: msgUserUpdated, statusCode: 200 },
    { type: userCreated, msg: msgUserCreated, statusCode: 201 },
    { type: tokenRenewed, msg: msgTokenRenewed, statusCode: 201 },
    { type: commentCreated, msg: msgCommentCreated, statusCode: 201 },
    { type: commentUpdated, msg: msgCommentUpdated, statusCode: 200 },
    { type: commentDeleted, msg: msgCommentDeleted, statusCode: 200 },
    { type: getResources, msg: msgGetResources, statusCode: 200 },
    { type: createResource, msg: msgCreateResource, statusCode: 201 },
    { type: updateResource, msg: msgUpdateResource, statusCode: 200 },
    { type: deleteResource, msg: msgDeleteResource, statusCode: 200 },
    { type: getCategories, msg: msgGetCategories, statusCode: 200 },
    { type: createCategorySuccess, msg: msgCreateCategory, statusCode: 201 },
    { type: updateCategorySuccess, msg: msgUpdateCategory, statusCode: 200 },
    { type: deleteCategorySuccess, msg: msgDeleteCategory, statusCode: 200 },
    { type: commentsFound, msg: msgCommentsFound, statusCode: 200 }
]
