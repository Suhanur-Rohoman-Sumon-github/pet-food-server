import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';


const router = Router()

const moduleRoutes = [
  {
    path:'/user',
    route:userRoutes
  },
 
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

export default router;