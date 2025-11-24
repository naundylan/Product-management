import express from 'express'
import { register, login, me, refresh, logout } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', verifyToken, refresh)
router.get('/me', verifyToken, me)
router.post('/logout', verifyToken, logout)

export default router