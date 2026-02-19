import express from 'express'
const UserRouter = express.Router()
import { createUser, fetchUser, login, logout, refreshToken, session, updateImage, forgotPassword, forgotSession, changePassword} from './user.controller'
import { AdminGuard, AdminUserGuard, ForgotSessionGuard, RefreshTokenGuard } from '../middleware/guard.middleware'

UserRouter.get('/', AdminGuard, fetchUser)
UserRouter.get('/session', AdminUserGuard, session)
UserRouter.get('/logout', logout)
UserRouter.post('/signup', createUser)
UserRouter.post('/login', login)
UserRouter.put('/update-image', AdminUserGuard, updateImage)
UserRouter.get('/refresh-token', RefreshTokenGuard, refreshToken)
UserRouter.post('/forgot-password', forgotPassword)
UserRouter.post('/forgot-session', ForgotSessionGuard, forgotSession)
UserRouter.post('/change-password', ForgotSessionGuard, changePassword)

export default UserRouter