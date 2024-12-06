import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catachAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";
const createUser = catchAsync(async (req, res) => {
 

  const userData = req.body;
  console.log(userData);

  const result = await UserServices.creteUserInDB(userData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'user is created successfully',
    data: result,
  });
});

export const userControllers = {
    createUser
}