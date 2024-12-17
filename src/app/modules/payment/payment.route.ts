import express from 'express';
import { paymentsControllers } from './payment.controller';




const router = express.Router();

router.post('/' , paymentsControllers.createPaymentIntent);


export const PaymentsRoute = router;