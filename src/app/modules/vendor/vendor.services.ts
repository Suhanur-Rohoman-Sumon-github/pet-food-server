import { PrismaClient, Vendor } from "@prisma/client";

const prisma = new PrismaClient()
const createVendorInDB = async (payload: Vendor) => {
    
    const result = await prisma.vendor.create({
        data:payload
    });

  return result;
};

export const VendorServices = {
    createVendorInDB
}
