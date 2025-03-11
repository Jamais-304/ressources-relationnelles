import { Router } from "express"
import { createUser, loginUser, logoutUser, refreshToken, adminCreateUser, getAllUsers, deleteUserById, modifyUser } from "../controllers/userControllers.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { auth } from "../middleware/auth.ts"
import { loginUserValidationRules, signUpUserValidationRules, refreshTokenValidationRule } from "../middleware/validators/userValidator.ts"

const router = Router()

//! Routes without authentication
// POST /api/v1/users/create-user
router.post("/v1/users/create-user", signUpUserValidationRules, validationErrorHandler, createUser)
// POST /api/v1/users/login
router.post("/v1/users/login", loginUserValidationRules, validationErrorHandler, loginUser)
// POST /api/v1/users/refreshToken
router.post("/v1/users/refresh-token", refreshTokenValidationRule, validationErrorHandler, refreshToken)
// POST/api/v1/users/logout
router.post("/v1/users/logout", refreshTokenValidationRule, validationErrorHandler, logoutUser)
//! Routes with authentication
// POST /api/v1/users/signup
router.post("/v1/users/admin/create-user", signUpUserValidationRules, validationErrorHandler, auth, adminCreateUser)
// GET /api/v1/users/get-all-users
router.get("/v1/users/get-all-users", auth, getAllUsers)
// DELETE /api/v1/users/delete-user/:id
router.get("/v1/users/delete-user/:id", auth, deleteUserById)
// PUT /api/v1/users/modify-user/:id
router.put("/v1/users/modify-user/:id", auth, modifyUser)
export default router
