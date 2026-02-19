import express from 'express'
const PaymentRouter = express.Router()
import { generateOrder, fetchPayment, webhook } from './payment.controller'
import { RazorpayGuard, UserGuard } from '../middleware/guard.middleware'

PaymentRouter.get('/', fetchPayment)
PaymentRouter.post('/order', UserGuard, generateOrder)
PaymentRouter.post('/webhook', RazorpayGuard, webhook)

export default PaymentRouter