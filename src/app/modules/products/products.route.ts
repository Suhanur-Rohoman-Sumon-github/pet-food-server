import express from 'express'
import { ProductsControllers } from './products.controllers'

const router = express.Router()

router.post('/', ProductsControllers.createProducts)
router.get('/', ProductsControllers.getALlProducts)
router.get('/:productId', ProductsControllers.getSingleProducts)

router.post('/category', ProductsControllers.createProductsCategory)
router.get('/related-products/:categoryId',ProductsControllers.getRelatedProducts)

router.post('/add-to-card/:userId/:productId', ProductsControllers.addCard)
router.get('/my-card/:userId', ProductsControllers.getMyCard)
router.delete('/remove/:userId', ProductsControllers.getMyCard)

router.post("/add-wishList/:productId/:userId",ProductsControllers.addProductInWishList)
router.get("/my-wishList/:userId",ProductsControllers.myWishList)

export const productRoute = router
