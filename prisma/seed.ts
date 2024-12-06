import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a Vendor
  const vendor = await prisma.vendor.create({
    data: {
      name: "Vendor A",
      location: "Location A",
      email: "vendorA@example.com",
      designation: "Owner",
      contactNo: "1234567890",
    },
  });

  // Create a Shop
  const shop = await prisma.shop.create({
    data: {
      name: "Shop A",
      location: "City Center",
      vendorId: vendor.id, // Link the Vendor
    },
  });

  // Create a Category
  const category = await prisma.category.create({
    data: {
      name: "Electronics",
    },
  });

  // Create a Product
  await prisma.product.create({
    data: {
      name: "Smartphone",
      price: 699.99,
      description: "A high-performance smartphone with a sleek design.",
      stock_quantity: 50,
      discount_price: 599.99,
      images: [
        "https://example.com/images/smartphone-front.jpg",
        "https://example.com/images/smartphone-back.jpg",
      ],
      shop_id: shop.id, // Link the Shop
      category_id: category.id, // Link the Category
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
