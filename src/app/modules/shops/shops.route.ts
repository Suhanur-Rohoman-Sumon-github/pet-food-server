import express from 'express'
import { shopControllers } from './shops.controller'


const router = express.Router()
router.post('/', shopControllers.createShope)
router.get('/:vendorId', shopControllers.getMyShops)
router.get('/', shopControllers.getAllShops)
router.get('/shop/:shopId', shopControllers.getSingleShop)
router.patch('/shop/:shopId/:userId', shopControllers.addFollowerInMyShop)
router.delete('/shop/:shopId', shopControllers.deleteShop)


export const shopeRoutes = router
