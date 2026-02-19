import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.DB as string)

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, {Request, Response} from 'express'
const app = express()
app.listen(8080)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

import UserRouter from './user/user.routes'
app.use('/user', UserRouter)

import CategoryRouter from './category/category.routes'
app.use('/category', CategoryRouter)

import StorageRouter from './storage/storage.routes'
app.use('/storage', StorageRouter)

import EbookRouter from './ebook/ebook.routes'
app.use('/ebook', EbookRouter)

import PaymentRouter from './payment/payment.routes'
app.use('/payment', PaymentRouter)

import OrderRouter from './order/order.routes'
app.use('/order', OrderRouter)

// import HelloRouter from './hello/hello.routes'
// app.use('/hello', HelloRouter)