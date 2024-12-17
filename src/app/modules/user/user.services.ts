/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User } from '@prisma/client'
import { payload } from '../admin/admin.interface'
import prisma from './user.midllware'
import { IPaginationOptions } from '../products/product.interface'
const creteUserInDB = async (payload: User) => {
  const result = await prisma.user.create({
    // @ts-ignore
    data: payload,
  })

  return result
}
const createAdminInDB = async (payload: payload) => {
  
  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        role: payload.role as any,
        status: payload.status ? (payload.status as any) : undefined,
        wishList: [],
        compare: [],
      },
    })

    let admin = null
    if (payload.role === 'ADMIN') {
      admin = await tx.admin.create({
        data: {
          id: user.id,
          name: payload.name,
          location: payload.location,
          email: payload.email,
          designation: payload.designation,
          contactNo: payload.contactNo,
        },
      })
    }
    console.log(admin);
    return admin
  })

  return result
}
const createVendorInDB = async (payload: payload) => {
  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        role: payload.role as any,
        status: payload.status ? (payload.status as any) : undefined,
        wishList: [],
        compare: [],
      },
    })

    let vendor = null
    if (payload.role === 'VENDOR') {
      vendor = await tx.vendor.create({
        data: {
          id: user.id,
          name: payload.name,
          location: payload.location,
          email: payload.email,
          designation: payload.designation,
          contactNo: payload.contactNo,
        },
      })
    }

    return { vendor, user }
  })

  return result
}

const blockUser = async (userId:string) =>{
 const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "Blocked", 
      },
    });

    return updatedUser;
}
const deleteUserFromDb = async (userId:string) =>{
 const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isDeleted: true, 
      },
    });

    return updatedUser;
}

const getAllUserFromDB = async (filters: any, options: IPaginationOptions) => {
  const { page, limit, sortBy, sortOrder } = options
  const skip = (page - 1) * limit

  const where: any = {}

  if (filters.role) where.role = filters.role
  if (filters.status) where.status = filters.status
  if (filters.searchTerm) {
    where.OR = [
      { name: { contains: filters.searchTerm, mode: 'insensitive' } },
      { email: { contains: filters.searchTerm, mode: 'insensitive' } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
  })

  const total = await prisma.user.count({ where })

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const UserServices = {
  creteUserInDB,
  createAdminInDB,
  createVendorInDB,
  getAllUserFromDB,
  blockUser,
  deleteUserFromDb
}
