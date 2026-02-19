import UserModel from './user.model'
import { Request, Response } from 'express'
import Exc from '../util/exc.util'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInterface } from './user.interface'
import { AuthInterface } from '../middleware/guard.middleware'
import sendMail from '../util/mail'
import { forgotPasswordTemplate } from '../util/template'

const FOURTEEN_MINUTE = 840000
const SIX_DAYS = 518400000

export const fetchUser = (req: Request, res: Response)=>{
	res.send("Hello")
}

const getToken = (user: UserInterface)=>{
	const payload = {
		id: user._id,
		fullname: user.fullname,
		email: user.email,
		mobile: user.mobile,
		role: user.role,
		image: user.image ? user.image : null
	}
	
	const accessToken = jwt.sign(payload, process.env.AUTH_SECRET as string, {expiresIn: '15m'})
	const refreshToken = jwt.sign(payload, process.env.RT_SECRET as string, {expiresIn: '7d'})

	return {
		accessToken,
		refreshToken
	}
}

export const createUser = Exc(async (req: Request, res: Response)=>{
	const user = new UserModel(req.body)
	await user.save()
	res.json({message: 'signup success'})
})

export const login = Exc(async (req: Request, res: Response)=>{
	const {email, password} = req.body

	const user: UserInterface | null = await UserModel.findOne({email})

	if(!user)
		return res.status(404).json({message: 'User doesn`t exists'})

	const isLoged = await bcrypt.compare(password, user.password)

	if(!isLoged)
		return res.status(401).json({message: 'Incorrect password'})

	const {accessToken, refreshToken} = getToken(user)
	res.cookie('accessToken', accessToken, {
		maxAge: FOURTEEN_MINUTE,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})
	res.cookie('refreshToken', refreshToken, {
		maxAge: SIX_DAYS,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})

	res.json({message: 'Login success !', role: user.role})
})

export const session = Exc(async (req: AuthInterface, res: Response)=>{	
	res.json(req.user)
})

export const logout = Exc(async (req: Request, res: Response)=>{
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

	res.json({message: 'Logout success !'})
})

export const updateImage = Exc(async (req: AuthInterface, res: Response)=>{
	await UserModel.findByIdAndUpdate(req.user.id, {image: req.body.image})
	res.json({message: "Image updated"})
})

export const refreshToken = Exc(async (req: AuthInterface, res: Response)=>{
	const user: UserInterface | null = await UserModel.findById(req.user.id)

	if(!user)
	{
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
		
		return res.status(401).json({message: "Logout success !"})
	}


	const {accessToken, refreshToken} = getToken(user)

	res.cookie('accessToken', accessToken, {
		maxAge: FOURTEEN_MINUTE,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})

	res.cookie('refreshToken', refreshToken, {
		maxAge: SIX_DAYS,
		domain: process.env.NODE_ENV === "dev" ? "localhost" : process.env.DOMAIN,
		secure: process.env.NODE_ENV === "dev" ? false : true,
		httpOnly: true
	})

	res.json({message: 'Token refresh success !', role: user.role})
})

export const forgotPassword = Exc(async (req: Request, res: Response)=>{
	const {email} = req.body
	const user = await UserModel.findOne({email})

	if(!user)
		return res.status(404).json({message: 'User doesn`t exist'})

	const token = await jwt.sign({id: user._id}, process.env.FORGOT_TOKEN_SECRET as string, {expiresIn: '15m'})
	const link = `${process.env.DOMAIN}/forgot-password?token=${token}`
	const sent = await sendMail(email, "Ebook - Forgot Password ?", forgotPasswordTemplate(user.fullname, link))

	if(!sent)
		return res.status(424).json({message: 'Email sending failed'})

	res.json({message: "Please check your mail for forgot link"})
})

export const forgotSession = Exc(async (req: Request, res: Response)=>{
	res.json({message: 'Verification success'})
})

export const changePassword = Exc(async (req: AuthInterface, res: Response)=>{
	const {password} = req.body
	const encrypted = await bcrypt.hash(password.toString(), 12)
	
	const user = await UserModel.findByIdAndUpdate(req.user.id, {password: encrypted})

	if(!user)
		return res.status(424).json({message: 'Failed to change password'})

	res.json({message: 'Password changed'})
})