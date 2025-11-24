import express from 'express'
import authRoute from './auth.route.js'
import productRoute from './product.route.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello world')
})
router.use('/auth', authRoute)
router.use('/products', productRoute)

export default router