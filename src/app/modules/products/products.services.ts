/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, PrismaClient, Product,Prisma  } from "@prisma/client";
import { IPaginationOptions, IProductFilterRequest } from "./product.interface";
import AppError from "../../error/Apperror";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient()

const createProductsInDB = async (payload: Product) => {
    
 
    const result = await prisma.product.create({
        data:payload
    });

  return result;
};
const getALlProductsFromDB = async (
  params: IProductFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.ProductWhereInput[] = [];

 
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

 
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }



  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
  };

  const products = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder
      ? { [options.sortBy]: options.sortOrder }
      : { created_at: "desc" }, 
  });

  
  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: products,
  };
};
const createCategoryInDB = async (payload:Category) => {
  const result = await prisma.category.create({
    data: payload
  });
  return result
};
const addCardInDB = async (userId:string,productId:string) => {
  const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(StatusCodes.NOT_FOUND,'product not found')
    }

     const result = await prisma.user.update({
      where: { id: userId },
      data: {
        card: {
          push: productId, 
        },
      },
    });
  return result
};
const getMyCardFromDb = async (userId:string) => {
   const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { card: true }, 
    });

     if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND,'User not found');
    }

     const productIds = user.card;

   
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds, 
        },
      },
    });
  return products
};



export const productsService = {
    createProductsInDB,
    createCategoryInDB,
    getALlProductsFromDB,
    addCardInDB,
    getMyCardFromDb
}