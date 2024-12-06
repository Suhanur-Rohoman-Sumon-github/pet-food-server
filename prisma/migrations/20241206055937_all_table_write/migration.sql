/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('inProgress', 'Blocked');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "category_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discount_price" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "shop_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "stock_quantity" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0.0,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'inProgress',
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT DEFAULT '',
    "cover_photo" TEXT DEFAULT '',
    "profile_picture" TEXT DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vendorId" TEXT NOT NULL,
    "ratings" INTEGER NOT NULL DEFAULT 0,
    "follower" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_vendorId_key" ON "Shop"("vendorId");

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
