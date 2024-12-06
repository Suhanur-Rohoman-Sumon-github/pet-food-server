import express from 'express'
import { ProductsControllers } from './products.controllers';

const router = express.Router();

router.post(
  '/',
  ProductsControllers.createProducts,
);
router.post(
  '/category',
  ProductsControllers.createProductsCategory,
);

export const productRoute = router