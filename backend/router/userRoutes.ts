import { Router } from "express"
import { createUser, loginUser, logoutUser, refreshToken, adminCreateUser } from "../controllers/userControllers.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { auth } from "../middleware/auth.ts"
import { loginUserValidationRules, signUpUserValidationRules, refreshTokenValidationRule } from "../middleware/validators/userValidator.ts"

const router = Router()

//! Routes without authentication
// POST /api/users/create-user
router.post("/v1/users/create-user", signUpUserValidationRules, validationErrorHandler, createUser)
// POST /api/users/login
router.post("/v1/users/login", loginUserValidationRules, validationErrorHandler, loginUser)
// POST /api/users/refreshToken
router.post("/v1/users/refresh-token", refreshTokenValidationRule, validationErrorHandler, refreshToken)
// POST/api/users/logout
router.post("/v1/users/logout", refreshTokenValidationRule, validationErrorHandler, logoutUser)
//! Routes with authentication
// POST /api/users/signup
router.post("/v1/users/admin/create-user", signUpUserValidationRules, validationErrorHandler, auth, adminCreateUser)

export default router
