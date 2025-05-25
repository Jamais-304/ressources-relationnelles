import { Router } from "express"
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getPublicCategories } from "../controllers/categoryController.ts"
import { auth } from "../middleware/auth.ts"

const router = Router()

// Route publique (accessible à tous)
router.get('/v1/categories/public', getPublicCategories)

// Routes protégées (administrateur/super-admin uniquement)
router.get('/v1/categories/', auth, getAllCategories)
router.get('/v1/categories/:id', auth, getCategoryById)
router.post('/v1/categories/', auth, createCategory)
router.put('/v1/categories/:id', auth, updateCategory)
router.delete('/v1/categories/:id', auth, deleteCategory)

export default router 