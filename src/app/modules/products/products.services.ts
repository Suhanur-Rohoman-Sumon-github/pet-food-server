import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient()

const createProductsInDB = async (payload: Product) => {
  const result = await prisma.product.create({
    data: {
      id: "p1q2r3s4-t5u6-7890-1234-56789abcdef1",
      name: "Smartphone",
      price: 699.99,
      description: "A high-performance smartphone with a sleek design.",
      stock_quantity: 50,
      discount_price: 599.99,
      images: [
        "https://example.com/images/smartphone-front.jpg",
        "https://example.com/images/smartphone-back.jpg"
      ],
      Shop: {
        connect: {
          id: "s1q2r3s4-t5u6-7890-1234-56789abcdef2"
        }
      },
      Category: { // Correctly named "Category"
        connect: {
          id: "c1q2r3s4-t5u6-7890-1234-56789abcdef3"
        }
      }
    }
  });

  return result;
};



const createProductsCategoryInDB = async (payload: Product) => {
    const result = await prisma.category.create({
        data:payload
    });

  return result;
};

export const productsService = {
    createProductsInDB,
    createProductsCategoryInDB
}