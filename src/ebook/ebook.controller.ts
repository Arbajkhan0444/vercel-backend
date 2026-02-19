import Exc from '../util/exc.util'
import EbookModel from './ebook.model'
import { Request, Response } from 'express'

export const fetchEbook = Exc(async (req: Request, res: Response)=>{
	const ebooks = await EbookModel.find().sort({createdAt: -1})
	res.json(ebooks)
})

export const createEbook = Exc(async (req: Request, res: Response)=>{
	const ebook = new EbookModel(req.body)
	await ebook.save()
	res.json(ebook)
})

export const updateEbook = Exc(async (req: Request, res: Response)=>{
	const {fieldType} = req.query
	const {id} = req.params
	let body = req.body

	if(fieldType && fieldType === "array")
		body = {$push: req.body}

	const ebook = await EbookModel.findByIdAndUpdate(id, body, {new: true})

	if(!ebook)
		return res.status(404).json({message: 'Ebook not found'})

	res.json(ebook)

})

export const deleteEbook = Exc(async (req: Request, res: Response)=>{
	const {id} = req.params
	const ebook = await EbookModel.findByIdAndDelete(id)

	if(!ebook)
		return res.status(404).json({message: 'Ebook not found'})

	res.json(ebook)
})