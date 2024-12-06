import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';
import { productRoute } from '../modules/products/products.route';
import { vendorRoutes } from '../modules/vendor/vendor.route';


const router = Router()

const moduleRoutes = [
  {
    path:'/user',
    route:userRoutes
  },
  {
    path:'/auth',
    route:authRouter
  },
  {
    path:'/products',
    route:productRoute
  },
  {
    path:'/vendors',
    route:vendorRoutes
  },
 
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

export default router;