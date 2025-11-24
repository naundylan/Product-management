import bcrypt from "bcryptjs";
import { config } from "../config/index.js";
import jwt from 'jsonwebtoken'

export function signAccessToken(payload) {
    return jwt.sign(payload, config.ACCESS_SECRET, {
        expiresIn: '15m'
    })
}

export function signRefreshToken(payload, jti) {
    return jwt.sign(payload, config.REFRESH_SECRET, {
        expiresIn: '7d',
        jwtid: jti
    })
}