/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, PrismaClient, Product, Prisma } from '@prisma/client'
import { IPaginationOptions, IProductFilterRequest } from './product.interface'
import AppError from '../../error/Apperror'
import { StatusCodes } from 'http-status-codes'

const prisma = new PrismaClient()

const createProductsInDB = async (
  payload: Partial<Product>,
  imageUrls: Express.Multer.File[] | undefined,
) => {
  const images = imageUrls ? imageUrls.map(image => image.path) : []
  const newData = { ...payload, images }

  const result = await prisma.product.create({
    // @ts-ignore
    data: newData,
  })
  
  return result
}
const getAllProductsFromDB = async (
  params: IProductFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, limit } = options
  const skip = (page - 1) * limit

  const { searchTerm, category, sort, ...filterData } = params

  const andConditions: Prisma.ProductWhereInput[] = []

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    })
  }

  let categoryId: string | undefined = undefined

  if (category) {
    const categoryData = await prisma.category.findFirst({
      where: { name: category },
    })

    if (!categoryData) {
      throw new Error(`Category "${category}" not found`)
    }

    categoryId = categoryData.id
  }

  if (categoryId) {
    andConditions.push({
      category_id: categoryId,
    })
  }

  if (Object.keys(filterData).length > 0) {
    const otherFilters = Object.keys(filterData).map(key => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }))

    if (otherFilters.length > 0) {
      andConditions.push({
        AND: otherFilters,
      })
    }
  }

  // Combine all conditions
  const whereConditions: Prisma.ProductWhereInput = {
    AND: andConditions,
  }

  // Map sort options to Prisma's `orderBy`
  let orderBy: any = { created_at: 'desc' }

  if (sort === 'high-to-low') {
    orderBy = { price: 'desc' }
  } else if (sort === 'low-to-high') {
    orderBy = { price: 'asc' }
  } else if (sort === 'rating-high-to-low') {
    orderBy = { rating: 'desc' }
  } else if (sort === 'rating-low-to-high') {
    orderBy = { rating: 'asc' }
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
  })

  // Count total products
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

const getSingleProductsFromDb = async (productsId: string) => {
  const result = await prisma.product.findUnique({
    where: {
      id: productsId,
    },
  })

  if (!result) {
    throw new Error('Product not found')
  }
  return result
}
const createCategoryInDB = async (payload: Category) => {
  const result = await prisma.category.create({
    data: payload,
  })
  return result
}
const deleteCategoryFromDb = async (categoryId: string) => {
 
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

 
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId }, 
    data: { isDeleted: false },    
  });

  return updatedCategory; 
}

const getALlCategoryFromDb = async () => {
  const result = await prisma.category.findMany({
    where: {
     isDeleted: false, 
    },
  });
  return result;
};
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
    throw new AppError(StatusCodes.BAD_REQUEST, 'product already in card')
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
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      images: true,
      shop_id:true
    },
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

const removeCardItemInDB = async (
  userId: string,
  productId: string | null,
  replaceCartWithNewItem?: boolean,
  newProductId?: string,
  clearCartOnPurchase?: boolean
) => {
  const user: any = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Clear the cart if the user has made a purchase
  if (clearCartOnPurchase) {
    const result = await prisma.user.update({
    where: { id: userId },
    data: { card: [] }, 
  });

    

    return result;
  }

 
  if (replaceCartWithNewItem) {
    const updatedCard = [{ productId: newProductId }];
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        card: updatedCard,
      },
    });

    return result;
  }

 
  if (
    productId &&
    (!user.card || !user.card.some((item: { productId: string }) => item.productId === productId))
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found in user's cart");
  }

 
  const updatedCard = user.card.filter(
    (item: { productId: string }) => item.productId !== productId,
  );

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      card: updatedCard,
    },
  });
 
  return result;
};


const addWishlistInDB = async (userId: string, productId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (user.wishList && user.wishList.includes(productId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Product already in wishlist')
  }

  const updatedWishList = [...(user.wishList || []), productId]

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      wishList: updatedWishList,
    },
  })

  return result
}
const removeWishlistItemInDB = async (userId: string, productId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (!user.wishList || !user.wishList.includes(productId)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found in wishlist')
  }

  const updatedWishList = user.wishList.filter(item => item !== productId)

  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      wishList: updatedWishList,
    },
  })

  return result
}
const getMyWishListProducts = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { wishList: true },
  })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  if (!user.wishList || user.wishList.length === 0) {
    return []
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: user.wishList },
    },
  })

  return products
}

const getRelatedProductsFromDb = async (categoryId: string) => {
  if (!categoryId) {
    throw new AppError(StatusCodes.NOT_FOUND, 'category not found')
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      category_id: categoryId,
    },
  })
  return relatedProducts
}
const addRecentVewInDb = async (productId: string,userId:string) => {
 

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error("User not found");
  }

 
  const recentViews = user.recentlyViewed || [];

  
  if (!recentViews.includes(productId)) {
    
    recentViews.push(productId);

    
   const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        recentlyViewed: recentViews,
      },
    });
  return result
}}
const getRecentProductFromDb = async (userId: string, ) => {
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { recentlyViewed: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let recentViews = user.recentlyViewed || [];

  

  
  if (recentViews.length > 8) {
    recentViews = recentViews.slice(-8); 
  }

  
  await prisma.user.update({
    where: { id: userId },
    data: { recentlyViewed: recentViews },
  });


  const recentProducts = await prisma.product.findMany({
    where: {
      id: { in: recentViews },
    },
  });

  return recentProducts;
};

const getMyFollowedShopProductsFromDb = async (userId: string) => {
 
  const followedShops = await prisma.shop.findMany({
    where: {
      follower: {
        array_contains: [userId], 
      },
    },
    select: { id: true },
  });

  const shopIds = followedShops.map(shop => shop.id);

 
  const products = await prisma.product.findMany({
    where: {
      shop_id: {
        in: shopIds, 
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      shop_id: true,
    },
  });


  const oneProductPerShop = shopIds.map(shopId => {
    return products.find(product => product.shop_id === shopId); 
  });

  return oneProductPerShop.filter(Boolean); 
};



const addReviewInDb = async (productId: string, payload: { rating: number; comment: string; userId: string }) =>{
      const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    
    if (!product) {
      throw new Error('Product not found');
    }

    const result = await prisma.product.update({
      where: { id: productId },
      data: {
        reviews: payload
      },
    });

    return result
}

export const productsService = {
  createProductsInDB,
  createCategoryInDB,
  getAllProductsFromDB,
  addCardInDB,
  getMyCardFromDb,
  removeCardItemInDB,
  addWishlistInDB,
  removeWishlistItemInDB,
  getSingleProductsFromDb,
  getRelatedProductsFromDb,
  getMyWishListProducts,
  getALlCategoryFromDb,
  addReviewInDb,
  deleteCategoryFromDb,
  addRecentVewInDb,
  getRecentProductFromDb,
  getMyFollowedShopProductsFromDb
}
