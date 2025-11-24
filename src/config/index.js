import dotenv from 'dotenv'

dotenv.config()

export const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET
}