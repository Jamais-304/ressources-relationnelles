import { Router } from "express"
import { validationErrorHandler } from "../middleware/validationErrorHandler.ts"
import { refreshTokenValidationRule } from "../middleware/validators/refreshTokenValidator.ts"
import { refreshToken } from "../controllers/refreshTokenController.ts"
const router = Router()
// POST /api/v1/users/refreshToken
router.post("/v1/users/refresh-token", refreshTokenValidationRule, validationErrorHandler, refreshToken)

export default router
