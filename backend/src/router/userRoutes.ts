import { Router } from "express"
import {
    createUser,
    loginUser,
    logoutUser,
    adminCreateUser,
    getAllUsers,
    deleteUserById,
    updateUser
} from "../controllers/userControllers.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { auth } from "../middleware/auth.ts"
import {
    loginUserValidationRules,
    signUpUserValidationRules,
    updateUserValidationRules,
    adminCreateUserValidationRules
} from "../middleware/validators/userValidator.ts"
import { refreshTokenValidationRule } from "../middleware/validators/refreshTokenValidator.ts"

const router = Router()

//! Routes without authentication
// POST /api/v1/users/create-user
router.post("/v1/users/create-user", signUpUserValidationRules, validationErrorHandler, createUser)
// POST /api/v1/users/login
router.post("/v1/users/login", loginUserValidationRules, validationErrorHandler, loginUser)
// POST/api/v1/users/logout
router.post("/v1/users/logout", refreshTokenValidationRule, validationErrorHandler, logoutUser)
//! Routes with authentication
// POST /api/v1/users/signup
router.post("/v1/users/admin/create-user", adminCreateUserValidationRules, validationErrorHandler, auth, adminCreateUser)
// GET /api/v1/users/get-all-users
router.get("/v1/users/get-all-users", auth, getAllUsers)
// DELETE /api/v1/users/delete-user/:id
router.delete("/v1/users/delete-user/:id", auth, deleteUserById)
// PUT /api/v1/users/modify-user/:id
router.put("/v1/users/update-user/:id", updateUserValidationRules, auth, updateUser)

export default router
