import express from 'express'
const CategoryRouter = express.Router()
import { createCategory, deleteCategory, fetchCategory, fetchCategoryById, updateCategory } from './category.controller'
import { AdminGuard } from '../middleware/guard.middleware'

CategoryRouter.get('/', fetchCategory)
CategoryRouter.get('/:id', AdminGuard, fetchCategoryById)
CategoryRouter.post('/', AdminGuard, createCategory)
CategoryRouter.put('/:id', AdminGuard, updateCategory)
CategoryRouter.delete('/:id', AdminGuard, deleteCategory)

export default CategoryRouter