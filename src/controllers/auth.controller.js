import { User } from "../models/User.model.js";
import { hashPassword, comparePassword } from "../helpers/hashPassword.helper.js";
import { signAccessToken, signRefreshToken } from "../helpers/generateToken.helper.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/index.js";
import crypto from "crypto"
import { sessions } from "../models/sessionStorage.js";

export const register = async (req, res) => {
    try {
        // lấy dữ liệu
        const { username, email, password } = req.body

        // kiểm tra dữ liệu
        if(!username || !email || !password) {
            return res.status(400).json('Lỗi dữ liệu bị trống, vui lòng điền đầy đủ thông tin để đăng ký!')
        }

        // kiểm tra user có tồn tại hay không
        const existUser = await User.findOne({ $or: [{ username}, { email }] })
        if(existUser) {
            return res.status(400).json('username hoặc email đã tồn tại!')
        }

        // hashPassword
        const hashedPassword = await hashPassword(password)

        // create new user
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
        })

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: user
        })
    } catch (error) {
        console.error('Register error', error);
        res.status(500).json({ message: 'Lỗi server hàm register!'})
    }
}

export const login = async (req, res) => {
    try {
        // Lấy dữ liệu
        const { email, password } = req.body

        // check dữ liệu có thiếu ko
        if(!email || !password) {
            return res.status(400).json({ message: 'Thiếu dữ liệu khi login!'})
        }

        // check email có tồn tại ko
        const user = await User.findOne({ email: email })
        if(!user) {
            return res.status(401).json('Sai email hoặc mật khẩu')
        }

        // check mật khẩu
        const isMatch = await comparePassword(password, user.password)
        if(!isMatch) {
            return res.status(401).json('Sai email hoặc mật khẩu')
        }

        // nếu toàn bộ điều kiện oke thì bắt đầu tạo cookie và token
        const accessToken = signAccessToken({ id: user._id, role: user.role })
        const jti = crypto.randomUUID()
        const refreshToken = signRefreshToken({ id: user._id, role: user.role }, jti)

        const decoded = jwt.decode(refreshToken)

        sessions.set(jti, {
            userId: user._id.toString(),
            jti: jti,
            expireAt: decoded.exp * 1000
        })

        // tạo cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        })

        res.status(201).json({
            message: 'Đăng nhập thành công',
            accessToken,
            jti: jti,
            loginMap: Object.fromEntries(sessions),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        
    }
}

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tìm user!' })
    }
}

export const refresh = async (req, res) => {
    try {
        // Lấy refreshToken từ cookie
        const oldRefreshToken = req.cookies.refreshToken

        // check dữ liệu
        if(!oldRefreshToken) {
            return res.status(401).json({ message: 'Không tìm thấy refreshToken'})
        }

        // lấy ra decode
        let decoded
        try {
            decoded = jwt.verify(oldRefreshToken, config.REFRESH_SECRET)
        } catch (error) {
            return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' })
        }

        // lấy ra jti
        const oldJti = decoded.jti

        // kiểm tra trong sessions
        const session = sessions.get(oldJti)
        if(!session) {
            return res.status(401).json({ message: 'Reuse attack!' })
        }
        sessions.delete(oldJti)

        // tạo mới payload
        const payload = {
            id: decoded.id,
            role: decoded.role
        }

        const newDecoded = jwt.decode(newRefreshToken)

        // tạo mới
        const newJti = crypto.randomUUID()
        const newAccessToken = signAccessToken(payload)
        const newRefreshToken = signRefreshToken(payload, newJti)

        // set sessions
        sessions.set(newJti, {
            userId: decoded.id,
            jti: newJti,
            expireAt: newDecoded.exp * 1000
        })

        // set cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        })

        res.status(201).json({
            message: 'Cấp mới accessToken thành công!',
            accessToken: newAccessToken,
            jti: newJti,
            loginMap: sessions
        })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi refresh token!' })
    }
}

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken
    if(token) {
        try {
            const decoded = jwt.verify(token, config.REFRESH_SECRET)
            if(decoded.jti)
                sessions.delete(decoded.jti)
        } catch (error) {
            // ignore
        }
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
    })

    res.status(200).json({
        status: true,
        message: 'Đăng xuất thành công',
        loginMap: sessions 
    })
}