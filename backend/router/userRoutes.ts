import { Router } from "express"
import { createUser, loginUser, logoutUser, refreshToken } from "../controllers/userControllers.ts"
import { loginUserValidationRules, signUpUserValidationRules, refreshTokenValidationRule } from "../middleware/validators/userValidator.ts"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
const router = Router()

// POST /api/users/signup
router.post("/signup", signUpUserValidationRules, validationErrorHandler, createUser)
// POST /api/users/login
router.post("/login", loginUserValidationRules, validationErrorHandler, loginUser)
// POST /api/users/refreshToken
router.post("/refreshToken", refreshTokenValidationRule, validationErrorHandler, refreshToken)
// POST/api/users/logout
router.post("/logout", refreshTokenValidationRule, validationErrorHandler, logoutUser)

export default router
