import { Router } from 'express'
import { createUser } from '../controllers/user.ts'

const router = Router()
// console.log( createUser)
// console.log(router.post('/user', createUser))
router.post('/user', createUser)

export default router