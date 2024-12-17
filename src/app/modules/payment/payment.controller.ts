import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catachAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.services";



const createPaymentIntent = catchAsync(async (req, res) => {
  const  {price}  = req.body;
  
  

  const results = await paymentService.createPaymentIntentInDb(price);
  sendResponse(res, {
    statusCode: StatusCodes.OK, 
    success: true,
    message: 'new payment intent added',
    data: results,
  });
});


export const paymentsControllers = {
  createPaymentIntent,

};