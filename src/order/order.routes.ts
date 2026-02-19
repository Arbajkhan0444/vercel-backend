import express from 'express'
const OrderRouter = express.Router()
import { fetchOrder } from './order.controller'
import { AdminUserGuard } from '../middleware/guard.middleware'

OrderRouter.get('/', AdminUserGuard, fetchOrder)

export default OrderRouter