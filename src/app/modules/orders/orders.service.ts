/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Order } from "@prisma/client"
import { prisma } from "../../utils/usePrismaClient"

const createOrderInDb = async (payload:Order ) => {
  console.log(payload);
   const result = await prisma.$transaction(async (prisma) => {
      // 1. Create the order
      const createdOrder = await prisma.order.create({
        // @ts-ignore
        data: payload,
      });

   
      await prisma.user.update({
        where: {
          id: payload.userId, 
        },
        data: {
          card: [], 
        },
      });

      // Return the created order
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