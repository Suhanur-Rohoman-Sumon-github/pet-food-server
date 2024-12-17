import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { productsService } from './products.services'
import pick from '../../utils/pick'
import { IPaginationOptions } from './product.interface'

const createProducts = catchAsync(async (req, res) => {

  const { name, description, price, stock_quantity, shop_id, category_id } =
    JSON.parse(req.body.data)

  let images: Express.Multer.File[] = []

  if (Array.isArray(req.files)) {
   
    images = req.files as Express.Multer.File[]
  } else if (req.files && typeof req.files === 'object') {
    
    images = Object.values(req.files).flat() as Express.Multer.File[]
  }

  const result = await productsService.createProductsInDB(
    { name, description, price, stock_quantity, shop_id, category_id },
    images,
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product created successfully',
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
const getProductCategory = catchAsync(async (req, res) => {
  
  const result = await productsService.getALlCategoryFromDb()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'category is retrieve successfully',
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

  

  const filters = pick(req.query, ['name', 'category', 'searchTerm', 'sort'])

  const result = await productsService.getAllProductsFromDB(filters, options)

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
const deleteCard = catchAsync(async (req, res) => {
  const { userId, productId } = req.params;
  const { replaceCartWithNewItem, newProductId, clearCartOnPurchase } = req.body;
  console.log(clearCartOnPurchase,replaceCartWithNewItem);

  console.log(req.body);

  // Clear the entire cart if a purchase is made
  if (clearCartOnPurchase) {
    const result = await productsService.removeCardItemInDB(userId, null, false, clearCartOnPurchase);
    
    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Cart cleared successfully after purchase',
      data: result,
    });
  }

  // Replace the cart with a new item
  if (replaceCartWithNewItem && newProductId) {
    const result = await productsService.removeCardItemInDB(
      userId,
      productId,
      replaceCartWithNewItem,
      newProductId,
    );

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Cart replaced successfully',
      data: result,
    });
  }

  // Otherwise, just remove the product from the cart
  const result = await productsService.removeCardItemInDB(userId, productId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Product removed from cart successfully',
    data: result,
  });
});


const getSingleProducts = catchAsync(async (req, res) => {
  const { productId } = req.params

  const result = await productsService.getSingleProductsFromDb(productId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'single data retrieve successfully',
    data: result,
  })
})
const getRelatedProducts = catchAsync(async (req, res) => {
  const { categoryId } = req.params

  const result = await productsService.getRelatedProductsFromDb(categoryId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'related product retrieve successfully',
    data: result,
  })
})
const addProductInWishList = catchAsync(async (req, res) => {
  const { productId, userId } = req.params

  const result = await productsService.addWishlistInDB(userId, productId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'related product retrieve successfully',
    data: result,
  })
})
const myWishList = catchAsync(async (req, res) => {
  const { userId } = req.params
  const result = await productsService.getMyWishListProducts(userId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'related product retrieve successfully',
    data: result,
  })
})

export const ProductsControllers = {
  createProducts,
  createProductsCategory,
  getALlProducts,
  addCard,
  getMyCard,
  getSingleProducts,
  getRelatedProducts,
  addProductInWishList,
  myWishList,
  getProductCategory,
  deleteCard
}
