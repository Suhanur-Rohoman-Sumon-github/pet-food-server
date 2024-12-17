import { StatusCodes } from "http-status-codes"
import catchAsync from "../../utils/catachAsync"
import sendResponse from "../../utils/sendResponse"
import { orderServices } from "./orders.service"

const createOrder = catchAsync(async (req, res) => {
  

  const result = await orderServices.createOrderInDb(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  })
})

export const orderControllers ={
    createOrder
}