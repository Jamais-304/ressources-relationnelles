import { Router } from 'express'
import { createUser, loginUser } from '../controllers/user.ts'
import { loginUserValidationRules, signUpUserValidationRules } from "../middleware/validators/userValidator.ts"
import { validationErrorHandler } from '../middleware/validationErrorHandler.ts'

const router = Router()

router.post('/inscription', signUpUserValidationRules, validationErrorHandler,  createUser)
router.post('/connexion', loginUserValidationRules, validationErrorHandler, loginUser)

export default router