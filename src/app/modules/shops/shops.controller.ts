import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catachAsync'
import sendResponse from '../../utils/sendResponse'
import { ShopsServices } from './shops.services'

const createShope = catchAsync(async (req, res) => {
  const result = await ShopsServices.createShopsInDB(req.body)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  })
})

export const shopControllers = {
  createShope,
}
