import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from '../controllers/product.controller.js'
import { verifyToken } from '../middleware/verifyToken.middleware.js'
import { authorize } from '../middleware/authorize.middleware.js'
const router = express.Router()

router.get('/', verifyToken, authorize(['admin']), getAllProducts)
router.get('/:id', verifyToken, authorize(['admin']), getOneProduct)
router.patch('/:id', verifyToken, authorize(['admin']), updateProduct)
router.delete('/:id', verifyToken, authorize(['admin']), deleteProduct)
router.post('/create', verifyToken, authorize(['admin']), createProduct)

export default router