import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { productsService } from './products.services'
import pick from '../../utils/pick'
import { IPaginationOptions } from './product.interface'

const createProducts = catchAsync(async (req, res) => {
  const result = await productsService.createProductsInDB(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'products is created successfully',
    data: result,
  })
})
const createProductsCategory = catchAsync(async (req, res) => {
  const result = await productsService.createCategoryInDB(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'category is created successfully',
    data: result,
  })
})
const getALlProducts = catchAsync(async (req, res) => {
  const options: IPaginationOptions = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
  }

  const filters = pick(req.query, ['name', 'category', 'searchTerm'])

  const result = await productsService.getALlProductsFromDB(filters, options)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result.data,
    meta: result.meta,
  })
})

const addCard = catchAsync(async (req, res) => {
  const { userId, productId } = req.params

  const result = await productsService.addCardInDB(userId, productId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'product added successfully',
    data: result,
  })
})
const getMyCard = catchAsync(async (req, res) => {
  const { userId } = req.params

  const result = await productsService.getMyCardFromDb(userId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'my card data retrieve successfully',
    data: result,
  })
})

export const ProductsControllers = {
  createProducts,
  createProductsCategory,
  getALlProducts,
  addCard,
  getMyCard,
}
