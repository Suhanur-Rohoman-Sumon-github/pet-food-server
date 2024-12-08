import { PrismaClient, Shop } from '@prisma/client'

const prisma = new PrismaClient()

const createShopsInDB = async (payload: Shop) => {
  const result = await prisma.shop.create({
    data: payload,
  })

  return result
}

export const ShopsServices = {
  createShopsInDB,
}
