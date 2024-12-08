import { AnyZodObject } from 'zod'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catachAsync'

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
    })
    next()
  })
}

export default validateRequest
