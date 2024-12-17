import express from 'express'
import { ProductsControllers } from './products.controllers'
import { multerUpload } from '../../config/multer.config'

const router = express.Router()

router.post(
  '/',
  multerUpload.array('images'),
  ProductsControllers.createProducts,
)
router.get('/', ProductsControllers.getALlProducts)
router.get('/:productId', ProductsControllers.getSingleProducts)

router.post('/category', ProductsControllers.createProductsCategory)
router.get('/categories/category', ProductsControllers.getProductCategory)
router.delete('/categories/category/:categoryId', ProductsControllers.deleteCategory)
router.get(
  '/related-products/:categoryId',
  ProductsControllers.getRelatedProducts,
)

router.post('/add-to-card/:userId/:productId', ProductsControllers.addCard)
router.get('/my-card/:userId', ProductsControllers.getMyCard)
router.delete('/remove/:userId/:productId', ProductsControllers.deleteCard)

router.post(
  '/add-wishList/:productId/:userId',
  ProductsControllers.addProductInWishList,
)
router.get('/my-wishList/:userId', ProductsControllers.myWishList)

router.get('/add-review/:productId', ProductsControllers.myWishList)
router.post('/add-products/add-recent-product/:productId/:userId', ProductsControllers.addRecentVew)
router.get('/get-product/get-recent-product/:userId', ProductsControllers.getRecentVew)

export const productRoute = router
