import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catachAsync";
import sendResponse from "../../utils/sendResponse";
import { productsService } from "./products.services";

const createProducts = catchAsync(async (req, res) => {
 
  const result = await productsService.createProductsInDB( req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'products is created successfully',
    data: result,
  });
});

export const ProductsControllers = {
    createProducts
}