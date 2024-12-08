/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, PrismaClient, Product, Prisma } from '@prisma/client'
import { IPaginationOptions, IProductFilterRequest } from './product.interface'
import AppError from '../../error/Apperror'
import { StatusCodes } from 'http-status-codes'

const prisma = new PrismaClient()

const createProductsInDB = async (payload: Product) => {
  const result = await prisma.product.create({
    data: payload,
  })

  return result
}
const getALlProductsFromDB = async (
  params: IProductFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, limit } = options
  const skip = (page - 1) * limit

  const { searchTerm, ...filterData } = params

  const andConditions: Prisma.ProductWhereInput[] = []

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    })
  }

  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
  }

  const products = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { created_at: 'desc' },
  })

  const total = await prisma.product.count({
    where: whereConditions,
  })

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: products,
  }
}
const createCategoryInDB = async (payload: Category) => {
  const result = await prisma.category.create({
    data: payload,
  })
  return result
}
const addCardInDB = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      card: true,
    },
  })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  const updatedCard: any =
    user.card && Array.isArray(user.card) ? user.card : []

  const existingProduct = updatedCard.find(
    (item: any) => item.productId === productId,
  )

  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    updatedCard.push({ productId, quantity: 1 })
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      card: updatedCard,
    },
  })

  return result
}

const getMyCardFromDb = async (userId: string) => {
 
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { card: true },
  })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  
  const card: any[] = user.card && Array.isArray(user.card) ? user.card : []

  const productIds = card.map(item => item.productId)


  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: { id: true, name: true, price: true, description: true }, 
  })

 
  const productsWithQuantity = products.map(product => {
   
    const productInCard = card.find(item => item.productId === product.id)
    return {
      ...product,
      quantity: productInCard?.quantity || 0, 
    }
  })

 
  const totalPrice = productsWithQuantity.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  )

 
  return {
    products: productsWithQuantity,
    totalPrice,
  }
}


const removeCardItemInDB = async (userId: string, productId: string) => {
  
  const user:any = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

 
  if (!user.card || !user.card.some((item: { productId: string }) => item.productId === productId)) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found in user's cart");
  }

  
  const updatedCard = user.card.filter((item: { productId: string }) => item.productId !== productId);

  // Update the user with the new cart (without the removed item)
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      card: updatedCard,
    },
  });

  return result;
};

// Service to add a product to the user's wishlist
const addWishlistInDB = async (userId: string, productId: string) => {
  // Fetch the user's current wishlist from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if the product is already in the wishlist to avoid duplicates
  if (user.wishList && user.wishList.includes(productId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product already in wishlist");
  }

  // Add the product ID to the wishlist
  const updatedWishList = [...(user.wishList || []), productId];

  // Update the user's wishlist
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      wishList: updatedWishList,
    },
  });

  return result;
};

// Service to remove a product from the user's wishlist
const removeWishlistItemInDB = async (userId: string, productId: string) => {
  // Fetch the user's current wishlist from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Check if the product exists in the wishlist
  if (!user.wishList || !user.wishList.includes(productId)) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found in wishlist");
  }

  // Filter out the item with the specified productId from the wishlist
  const updatedWishList = user.wishList.filter(item => item !== productId);

  // Update the user with the new wishlist (without the removed item)
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      wishList: updatedWishList,
    },
  });

  return result;
};




export const productsService = {
  createProductsInDB,
  createCategoryInDB,
  getALlProductsFromDB,
  addCardInDB,
  getMyCardFromDb,
  removeCardItemInDB,
  addWishlistInDB,
  removeWishlistItemInDB
}
