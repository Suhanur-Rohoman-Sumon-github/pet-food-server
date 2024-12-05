

import express from 'express';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middleware/validateRequests';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/register',
  validateRequest(userValidation.createUserValidationSchema),
  userControllers.createUser,
);

router.post(
  '/change-password',
  AuthControllers.changePassword
);
router.post(
  '/forget-password',
  AuthControllers.forgetPassword,
);
router.post(
  '/reset-password',
  
  AuthControllers.resetPassword,
);
router.post('/refresh-token', AuthControllers.getRefreshToken);



export const authRouter = router;