import { AuthInterface } from '../middleware/guard.middleware'
import { fetchPaymentById } from '../payment/payment.controller'
import Exc from '../util/exc.util'
import { CreateOrderInterface } from './order.interface'
import OrderModel from './order.model'
import { Request, Response } from 'express'

export const fetchOrder = Exc(async (req: AuthInterface, res: Response)=>{
	let orders = []
	let modified = []

	const {role, id} = req.user

	if(role === "user")
	{
		orders = await OrderModel.find({user: id, status: 'success'}).sort({createdAt: -1}).populate("ebook").lean()
		return res.json(orders)
	}

	else
	{
		const page = Number(req.query.page) ? Number(req.query.page) : 1
		const limit = Number(req.query.limit) ? Number(req.query.limit) : 6

		const skip = (page-1)*limit

		orders = await OrderModel.find()
		.skip(skip)
		.limit(limit)
		.populate("ebook", "title -_id")
		.populate("user", "email fullname mobile -_id")
		.lean()
	}
		
		
	for(let order of orders)
	{
		const paymentId = order.paymentId
		const payment = await fetchPaymentById(paymentId)
		modified.push({
			...order,
			payment
		})
	}

	const total = await OrderModel.countDocuments()
	res.json({
		total,
		data: modified
	})
})

// Helper (Webhook)
export const createOrder = async (data: CreateOrderInterface)=>{
	try {
		const order = new OrderModel(data)
		await order.save()
		return order
	}
	catch(err)
	{
		return err
	}
}
