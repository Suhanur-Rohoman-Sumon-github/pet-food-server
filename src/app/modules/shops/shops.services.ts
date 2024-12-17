/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Shop } from '@prisma/client'
import { IPaginationOptions } from '../products/product.interface'
import AppError from '../../error/Apperror'

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

    const blockedShop = result.find((shop) => shop.isDeleted === true);

  if (blockedShop) {
    throw new AppError(403,"Shop is blocked.");
  }

  return result
}
const getSingleShopFromDB = async (id: string) => {
  const result = await prisma.shop.findUnique({
    where: { id: id },
    include:{products:true}
  })

  return result
}
const deleteShopFromDb = async (id: string) => {
  const result = await prisma.shop.update({
    where: { id: id },
    data: {
      isDeleted: true, 
    },
    
  });

  return result;
};
const addFollowerInMyShopInDb = async (shopId: string, userId: string) => {
 
  const shop = await prisma.shop.findUnique({
    where: { id: shopId }
  });

  if (!shop) {
    throw new Error(`Shop with id ${shopId} not found`);
  }

  
  const currentFollowers = Array.isArray(shop.follower) ? shop.follower : [];

  
  if (currentFollowers.includes(userId)) {
    throw new Error(`User with id ${userId} is already following this shop.`);
  }

 
  const updatedFollowers = [...currentFollowers, userId];


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

  // Prepare the query with optional filters
  const query: any = {
    where: {},
    orderBy: {
      [validSortBy]: sortOrder,
    },
    skip: (page - 1) * limit,
    take: limit,
   
  };

  // Add filters if they exist
  if (filters.searchTerm) {
    query.where.name = {
      contains: filters.searchTerm,
      mode: 'insensitive',
    };
  }

  if (filters.status) {
    query.where.status = filters.status;
  }

  // Fetch the data
  const data = await prisma.shop.findMany(query);
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
  addFollowerInMyShopInDb,
  deleteShopFromDb
}
