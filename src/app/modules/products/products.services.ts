import { Category, PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient()

const createProductsInDB = async (payload: Product) => {
    
 
    const result = await prisma.product.create({
        data:payload
    });

  return result;
};
const createCategoryInDB = async (payload:Category) => {
  const result = await prisma.category.create({
    data: payload
  });
  return result
};


export const productsService = {
    createProductsInDB,
    createCategoryInDB
}