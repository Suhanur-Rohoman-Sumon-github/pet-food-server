import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.services'
const createUser = catchAsync(async (req, res) => {
  const userData = req.body

  const result = await UserServices.creteUserInDB(userData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  })
})
const createAdmin = catchAsync(async (req, res) => {
  

  const result = await UserServices.createAdminInDB(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'admin is created successfully',
    data: result,
  })
})

export const userControllers = {
  createUser,
  createAdmin
}
