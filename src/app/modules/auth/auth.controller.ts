
import {
	StatusCodes,
} from 'http-status-codes';
import config from '../../config';
import catchAsync from '../../utils/catachAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from "../../error/Apperror";


const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthServices.loginUser(req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_Env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});
const getRefreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const results = await AuthServices.getRefreshToken(refreshToken);

  sendResponse(res, {
  statusCode: StatusCodes.OK,
    success: true,
    message: 'access token retrieve successfully',
    data: results,
  });
});


const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userEmail = req.body.email;
  console.log(userEmail);
  const result = await AuthServices.forgetPassword(userEmail);
  sendResponse(res, {
   statusCode: StatusCodes.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;


  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Something went wrong !');
  }

  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});


export const AuthControllers = {
  loginUser,
  getRefreshToken,
  changePassword,
  forgetPassword,
  resetPassword
};