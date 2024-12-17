import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.services'
import { IPaginationOptions } from '../products/product.interface'
import pick from '../../utils/pick'
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
const createVendor = catchAsync(async (req, res) => {
  const result = await UserServices.createVendorInDB(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'vendor is created successfully',
    data: result,
  })
})
const makeUserBlock = catchAsync(async (req, res) => {
  const {userId} = req.params
  const result = await UserServices.blockUser(userId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is blocked successfully',
    data: result,
  })
})
const deleteUser = catchAsync(async (req, res) => {
  const {userId} = req.params
  const result = await UserServices.deleteUserFromDb(userId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is blocked successfully',
    data: result,
  })
})
const getAllUser = catchAsync(async (req, res) => {
  const options: IPaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
  }


  const filters = pick(req.query, ['role', 'status', 'searchTerm'])

 
  const result = await UserServices.getAllUserFromDB(filters, options)


  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All users retrieved successfully',
    data: result.data,
    meta: result.meta,
  })
})

export const userControllers = {
  createUser,
  createAdmin,
  createVendor,
  getAllUser,
  makeUserBlock,
  deleteUser
}
