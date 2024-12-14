import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.services'
import { IPaginationOptions } from '../products/product.interface'
import pick from '../../utils/pick'
const createUser = catchAsync(async (req, res) => {
  const userData = req.body
  console.log(userData);

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
const getAllUser = catchAsync(async (req, res) => {
  
  const options: IPaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
  };
  

  // Filters for the query
  const filters = pick(req.query, ['role', 'status', 'searchTerm']);

  // Fetching filtered and paginated users
  const result = await UserServices.getAllUserFromDB(filters, options);

  // Sending the response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All users retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});


export const userControllers = {
  createUser,
  createAdmin,
  createVendor,
  getAllUser
}
