import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utils/catachAsync';
import AppError from '../error/Apperror';
import { StatusCodes } from 'http-status-codes';

// Define the possible roles
type TUserRol = 'ADMIN' | 'VENDOR' | 'USER';

const Auth = (...requiredRoles: TUserRol[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Authorization token is missing or invalid',
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.access_secret_key as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
    }

    // Ensure the token has a valid role
    if (!decoded || !decoded.role || !requiredRoles.includes(decoded.role as TUserRol)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have access to this route',
      );
    }

    // Attach the decoded payload to the request
    req.user = decoded;

    next();
  });
};

export default Auth;
