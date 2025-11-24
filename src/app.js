// import
import express from 'express'
import connectDB from './config/db.js'
import rootRouter from './routes/index.js'
import cookieParser from 'cookie-parser'

// active
const app = express()

// connect DB
await connectDB()

// middleware
app.use(express.json())
app.use(cookieParser())

// route
app.use('/api', rootRouter)


// export
export default app