/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Order } from "@prisma/client"
import { prisma } from "../../utils/usePrismaClient"

const createOrderInDb = async (payload:Order ) => {
 
   const result = await prisma.$transaction(async (order) => {
   
      const createdOrder = await order.order.create({
        // @ts-ignore
        data: payload,
      });

   
      await order.user.update({
        where: {
          id: payload.userId, 
        },
        data: {
          card: [], 
        },
      });
      return createdOrder;
    });
  return result
}
const getMyOrdersFromDb = async (userId:string ) => {
  const result = await prisma.order.findMany({
   where:{userId}
  })

  return result
}

export const orderServices = {
    createOrderInDb,
    getMyOrdersFromDb
}