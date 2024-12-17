/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Shop } from '@prisma/client'
import { IPaginationOptions } from '../products/product.interface'

const prisma = new PrismaClient()

const createShopsInDB = async (payload: Shop) => {
  
  const result = await prisma.shop.create({
    //@ts-ignore
    data: payload,
  })

  return result
}
const getMyShopsFromDb = async (id: string) => {
  const result = await prisma.shop.findMany({
    where: { vendorId: id },
  })

  return result
}
const getSingleShopFromDB = async (id: string) => {
  const result = await prisma.shop.findUnique({
    where: { id: id },
    include:{products:true}
  })

  return result
}
const addFollowerInMyShopInDb = async (shopId: string, userId: string) => {
  // Step 1: Find the shop by ID
  const shop = await prisma.shop.findUnique({
    where: { id: shopId }
  });

  if (!shop) {
    throw new Error(`Shop with id ${shopId} not found`);
  }

  // Step 2: Ensure `follower` is always an array
  const currentFollowers = Array.isArray(shop.follower) ? shop.follower : [];

  // Step 3: Check if the userId already exists in the followers array
  if (currentFollowers.includes(userId)) {
    throw new Error(`User with id ${userId} is already following this shop.`);
  }

  // Step 4: Append the new userId to the followers array
  const updatedFollowers = [...currentFollowers, userId];

  // Step 5: Update the shop with the new followers array
  const result = await prisma.shop.update({
    where: { id: shopId },
    data: {
      follower: updatedFollowers,
    },
  });

  return result;
};





const getAllShopsFromDB = async (filters: any, options: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder } = options;

   const validSortBy = sortBy || 'name';

 
  const query = {
    where: {
      ...filters.searchTerm && {
        name: {
          contains: filters.searchTerm, 
          mode: 'insensitive',  
        },
      },
      ...filters.status && { status: filters.status },  
    },
    orderBy: {
      [validSortBy]: sortOrder, 
    },
    skip: (page - 1) * limit, 
    take: limit,  
  };

  
  const data = await prisma.shop.findMany(query);

  // Get the total count for pagination metadata
  const totalCount = await prisma.shop.count({
    where: query.where,
  });

  return {
    data,
    meta: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
    },
  };
};

export const ShopsServices = {
  createShopsInDB,
  getMyShopsFromDb,
  getAllShopsFromDB,
  getSingleShopFromDB,
  addFollowerInMyShopInDb
}
