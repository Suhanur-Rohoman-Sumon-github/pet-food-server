import { Response } from 'express'

type TResponse<T> = {
  statusCode: number
  success: boolean
  message?: string
  token?: string
  data: T
  meta?: object
}

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  const { statusCode, success, message, data, meta } = responseData
  const response: Record<string, unknown> = {
    success,
    statusCode,
    message,
    data,
    meta,
  }

  res.status(statusCode).json(response)
}

export default sendResponse
