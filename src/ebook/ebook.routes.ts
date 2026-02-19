import express from 'express'
const EbookRouter = express.Router()
import { createEbook, deleteEbook, fetchEbook, updateEbook } from './ebook.controller'
import { AdminGuard } from '../middleware/guard.middleware'

EbookRouter.get('/', fetchEbook)
EbookRouter.post('/', AdminGuard, createEbook)
EbookRouter.put('/:id', AdminGuard, updateEbook)
EbookRouter.delete('/:id', AdminGuard, deleteEbook)

export default EbookRouter