import express from 'express'
import { ProductsControllers } from './products.controllers'

const router = express.Router()

router.post('/', ProductsControllers.createProducts)
router.post('/category', ProductsControllers.createProductsCategory)
router.get('/', ProductsControllers.getALlProducts)
router.post('/add-to-card/:userId/:productId', ProductsControllers.addCard)
router.get('/my-card/:userId', ProductsControllers.getMyCard)
router.patch('/remove/:userId', ProductsControllers.getMyCard)

export const productRoute = router
