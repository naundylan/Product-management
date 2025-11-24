import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    // check authHeader
    if(!authHeader) {
        return res.status(401).json({ message: 'Chưa có header authorization token' })
    }

    // lấy token
    const token = authHeader.split(' ')[1]

    // check token
    if(!token) {
        return res.status(401).json({ message: 'Token không hợp lệ!' })
    }

    try {
        const decoded = jwt.verify(token, config.ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' })
    }
}