import express from 'express'
import { shopControllers } from './shops.controller';




const router = express.Router();
router.post(
  '/',
  shopControllers.createShope,
);


export const shopeRoutes = router