import Exc from '../util/exc.util'
import CategoryModel from './category.model'
import { Request, Response } from 'express'

export const fetchCategory = Exc(async (req: Request, res: Response)=>{
	const categories = await CategoryModel.find()
	res.json(categories)
})

export const fetchCategoryById = Exc(async (req: Request, res: Response)=>{
	const category = await CategoryModel.findById(req.params.id)
	
	if(!category)
		return res.status(404).json({message: 'category not found'})

	res.json(category)
})

export const createCategory = Exc(async (req: Request, res: Response)=>{
	const category = new CategoryModel(req.body)
	await category.save()
	res.json(category)
})

export const updateCategory = Exc(async (req: Request, res: Response)=>{
	const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {new: true})

	if(!category)
		return res.status(404).json({message: 'category not found'})

	res.json(category)
})

export const deleteCategory = Exc(async (req: Request, res: Response)=>{
	const category = await CategoryModel.findByIdAndDelete(req.params.id)

	if(!category)
		return res.status(404).json({message: 'category not found'})

	res.json(category)
})