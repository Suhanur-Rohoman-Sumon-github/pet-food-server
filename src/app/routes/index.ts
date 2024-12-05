import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { authRouter } from '../modules/auth/auth.route';


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
 
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

export default router;