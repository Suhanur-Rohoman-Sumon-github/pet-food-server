/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Order } from "@prisma/client"
import { prisma } from "../../utils/usePrismaClient"

const createOrderInDb = async (payload:Order ) => {
  const result = await prisma.order.create({
    // @ts-ignore
    data: payload,
  })

  return result
}

export const orderServices = {
    createOrderInDb
}