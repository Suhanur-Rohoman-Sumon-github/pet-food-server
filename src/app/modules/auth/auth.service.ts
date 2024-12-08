import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmails';
import config from '../../config';
import AppError from '../../error/Apperror';

const prisma = new PrismaClient();

const loginUser = async (payload: User) => {
  console.log(payload);
  
  const isUserExists = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  console.log(isUserExists);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, isUserExists.password);
  if (!isPasswordValid) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong password');
  }

  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
    email: isUserExists.email,
  };

  

  const accessToken = createToken(jwtPayload, config.access_secret_key as string, config.JWT_ACCESS_EXPIRES_IN as string) ;
 
  const refreshToken = createToken(jwtPayload, config.refresh_secret_key as string, config.JWT_REFRESH_EXPIRES_IN as string);

  return {
    accessToken,
    refreshToken,
    user: isUserExists,
  };
};

const getRefreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Refresh token is required');
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, config.refresh_secret_key as string) as JwtPayload;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new AppError(StatusCodes.UNAUTHORIZED, error.message||'Invalid refresh token');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const accessToken = createToken(
    { userId: user.id, role: user.role },
    config.access_secret_key as string,
    config.JWT_ACCESS_EXPIRES_IN as string,
  );

  return { accessToken };
};

const changePassword = async (userId: string, payload: { oldPassword: string; newPassword: string }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Incorrect old password');
  }

  const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });

  return null;
};

const forgetPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const resetToken = createToken( {userId:user.id,role:user.role,email:user.email}, config.access_secret_key as string, '10m');
  const resetUILink = `${config.reset_pass_ui_link}?email=${email}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);
};

const resetPassword = async (payload: { email: string; newPassword: string }, token: string) => {
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, config.access_secret_key as string) as JwtPayload;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new AppError(StatusCodes.FORBIDDEN, error.message||'Invalid or expired token');
  }

  if (payload.email !== decoded.email) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Email mismatch');
  }

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));
  await prisma.user.update({
    where: { email: payload.email },
    data: { password: newHashedPassword },
  });

  return { message: 'Password reset successful' };
};

export const AuthServices = {
  loginUser,
  getRefreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
