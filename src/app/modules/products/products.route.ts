import express from 'express'
import { ProductsControllers } from './products.controllers';

const router = express.Router();

router.post(
  '/',
  ProductsControllers.createProducts,
);

export const productRoute = router