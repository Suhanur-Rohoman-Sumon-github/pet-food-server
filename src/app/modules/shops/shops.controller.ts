import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { ShopsServices } from './shops.services'
import { IPaginationOptions } from '../products/product.interface'
import pick from '../../utils/pick'

const createShope = catchAsync(async (req, res) => {
  
  const result = await ShopsServices.createShopsInDB(req.body)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'shop is created successfully',
    data: result,
  })
})
const getMyShops = catchAsync(async (req, res) => {
  const vendorId = req.params.vendorId as string

  const result = await ShopsServices.getMyShopsFromDb(vendorId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'shop is retrieve successfully',
    data: result,
  })
})
const getSingleShop = catchAsync(async (req, res) => {
  const shopId = req.params.shopId as string
  

  const result = await ShopsServices.getSingleShopFromDB(shopId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'shop is retrieve successfully',
    data: result,
  })
})
const addFollowerInMyShop = catchAsync(async (req, res) => {
  const {shopId,userId} = req.params 
  

  const result = await ShopsServices.addFollowerInMyShopInDb(shopId,userId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'shop is retrieve successfully',
    data: result,
  })
})
const deleteShop = catchAsync(async (req, res) => {
  const {shopId} = req.params 
  

  const result = await ShopsServices.deleteShopFromDb(shopId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'shop is retrieve successfully',
    data: result,
  })
})
const getAllShops = catchAsync(async (req, res) => {
  const options: IPaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string || 'name',
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
  };

  
  

  
  const filters = pick(req.query, ['status', 'searchTerm']);
  
  
  

  const result = await ShopsServices.getAllShopsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Shops retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});



export const shopControllers = {
  createShope,
  getMyShops,
  getAllShops,
  getSingleShop,
  addFollowerInMyShop,
  deleteShop
}
