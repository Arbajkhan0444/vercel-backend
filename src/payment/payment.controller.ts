import Exc from '../util/exc.util'
import PaymentModel from './payment.model'
import { NextFunction, Request, Response } from 'express'
import Razorpay from 'razorpay'
import EbookModel from '../ebook/ebook.model'
import discount from '../util/discount'
import fs from 'fs'
import { createOrder } from '../order/order.controller'

const instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY as string,
	key_secret: process.env.RAZORPAY_SECRET as string
})

export const fetchPayment = (req: Request, res: Response)=>{
	res.send("Hello")
}

export const generateOrder = Exc(async (req: Request, res: Response)=>{
	const {ebookId} = req.body
	const ebook = await EbookModel.findById(ebookId)

	if(!ebook)
		return res.status(400).json({message: 'Bad Request'})

	const order = await instance.orders.create({
		amount: Math.round(discount(ebook.price, ebook.discount)*100),
		currency: 'INR',
		receipt: `EBOOK_RN_${Date.now()}`
	})
	res.json(order)
})

const paymentFailed = Exc(async (req: Request, res: Response)=>{
	const { notes, id, amount} = req.body.payload.payment.entity
	await createOrder({
		user: notes.user,
		ebook: notes.ebook,
		paymentId: id,
		discount: Number(notes.discount),
		status: 'failed',
		amount: (amount/100)
	})
	res.json({success: true})
})

const paymentSuccess = Exc(async (req: Request, res: Response)=>{
	const { notes, id, amount} = req.body.payload.payment.entity
	await createOrder({
		user: notes.user,
		ebook: notes.ebook,
		paymentId: id,
		discount: Number(notes.discount),
		status: 'success',
		amount: (amount/100)
	})
	res.json({success: true})
})

export const webhook = Exc(async (req: Request, res: Response, next: NextFunction)=>{
	fs.writeFileSync("payment.json", JSON.stringify(req.body, null, 2))
	const payload = req.body

	if(process.env.NODE_ENV === "dev" && payload.event === "payment.authorized")
		return paymentSuccess(req, res, next)


	if(process.env.NODE_ENV === "prod" && payload.event === "payment.success")
		return paymentSuccess(req, res, next)

	if(payload.event === "payment.failed")
		return paymentFailed(req, res, next)

	res.json({success: true})
})

// Helper (Order Controller)
export const fetchPaymentById = async (paymentId: string)=>{
	try {
		const payment = await instance.payments.fetch(paymentId)
		return payment
	}
	catch(err)
	{
		return err
	}
}