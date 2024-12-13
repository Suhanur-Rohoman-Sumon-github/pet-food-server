/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { User } from '@prisma/client'
import { payload } from '../admin/admin.interface'
import prisma from './user.midllware'
const creteUserInDB = async (payload: User) => {
  const result = await prisma.user.create({
    // @ts-ignore
    data: payload,
  })

  return result
}
const createAdminInDB = async (payload:payload) => {
  const result = await prisma.$transaction(async (tx) => {
  
    const user = await tx.user.create({
      data: {
        email: payload.email,
        password: payload.password, 
        role: payload.role as any, 
        status: payload.status ? (payload.status as any) : undefined,
        wishList: [], 
        compare: [],
      },
    });

    
    let admin = null;
    if (payload.role === 'ADMIN') {
      admin = await tx.admin.create({
        data: {
          name: payload.name,
          location: payload.location,
          email: payload.email,
          designation: payload.designation,
          contactNo: payload.contactNo,
           user: { connect: { id: user.id } }
        },
      });
    }

    return {  admin };
  });

  return result;
};


export const UserServices = {
  creteUserInDB,
  createAdminInDB
}
