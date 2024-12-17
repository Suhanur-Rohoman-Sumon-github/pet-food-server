import express from 'express'
import { orderControllers } from './order.controller';


const router = express.Router()

router.post('/' , orderControllers.createOrder);
router.get('/:userId' , orderControllers.getMyOrders);

export const orderRoute = router
