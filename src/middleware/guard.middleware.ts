import { NextFunction, Request, Response } from "express";
import Exc from "../util/exc.util";
import jwt from 'jsonwebtoken'
import crypto, { sign } from 'crypto'

export interface AuthInterface extends Request {
    user: any
}

const expireSession = async (res: Response)=>{
	res.cookie('accessToken', null, {
		maxAge: 0,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})
	res.cookie('refreshToken', null, {
		maxAge: 0,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})

	res.status(400).json({message: 'Bad Request'})
}

export const AdminGuard = Exc(async (req: AuthInterface, res: Response, next: NextFunction)=>{
    const { accessToken } = req.cookies

    if(!accessToken)
        return expireSession(res)

    const payload: any = await jwt.verify(accessToken, process.env.AUTH_SECRET as string)

    if(payload.role !== "admin")
        return expireSession(res)

    req.user = payload
    next()
})

export const UserGuard = Exc(async (req: AuthInterface, res: Response, next: NextFunction)=>{
    const { accessToken } = req.cookies

    if(!accessToken)
        return expireSession(res)

    const payload: any = await jwt.verify(accessToken, process.env.AUTH_SECRET as string)

    if(payload.role !== "user")
        return expireSession(res)

    req.user = payload
    next()
})

export const AdminUserGuard = Exc(async (req: AuthInterface, res: Response, next: NextFunction)=>{
    const { accessToken } = req.cookies

    if(!accessToken)
        return expireSession(res)

    const payload: any = await jwt.verify(accessToken, process.env.AUTH_SECRET as string)

    if(payload.role !== "user" && payload.role !== "admin")
        return expireSession(res)

    req.user = payload
    next()
})

export const RazorpayGuard = Exc(async (req: AuthInterface, res: Response, next: NextFunction)=>{
    const signature = req.headers['x-razorpay-signature']

    if(!signature && signature === undefined)
        return res.status(400).send("Bad request")

    const payload = req.body
    
    const mySignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
    .update(JSON.stringify(payload))
    .digest('hex')

    if(signature !== mySignature)
        return res.status(400).send("Bad request")

    next()
})

export const RefreshTokenGuard = Exc(async (req: AuthInterface, res: Response, next: NextFunction)=>{
    const { refreshToken } = req.cookies

    if(!refreshToken)
        return expireSession(res)

    const payload: any = await jwt.verify(refreshToken, process.env.RT_SECRET as string)

    if(payload.role !== "user" && payload.role !== "admin")
        return expireSession(res)

    req.user = payload
    next()
})


export const ForgotSessionGuard = Exc(async (req: AuthInterface, res: Response, next: NextFunction)=>{
    const authorization = req.headers['authorization']

    if(!authorization)
        return res.status(400).send("Bad request")

    const [type, token] = authorization.split(" ")

    if(type !== "Bearer")
        return res.status(400).send("Bad request")

    const payload = await jwt.verify(token, process.env.FORGOT_TOKEN_SECRET as string)

    req.user = payload

    next()

})