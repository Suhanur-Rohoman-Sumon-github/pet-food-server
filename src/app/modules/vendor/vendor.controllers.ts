import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catachAsync";
import sendResponse from "../../utils/sendResponse";
import { VendorServices } from "./vendor.services";

const createVendorInDB = catchAsync(async (req, res) => {

  const result = await VendorServices.createVendorInDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  });
});

export const VendorControllers = {
    createVendorInDB
}