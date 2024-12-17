import { StatusCodes } from "http-status-codes"
import catchAsync from "../../utils/catachAsync"
import sendResponse from "../../utils/sendResponse"
import { orderServices } from "./orders.service"

const createOrder = catchAsync(async (req, res) => {
  

  const result = await orderServices.createOrderInDb(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'order is created successfully',
    data: result,
  })
})
const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.params.id as string

  const result = await orderServices.getMyOrdersFromDb(userId)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'order is created successfully',
    data: result,
  })
})

export const orderControllers ={
    createOrder,
    getMyOrders
}