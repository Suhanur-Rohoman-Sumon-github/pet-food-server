import { User } from "@prisma/client";
import prisma from "./user.midllware";




const creteUserInDB = async (payload: User) => {
    
    const result = await prisma.user.create({
        data:payload
    });

  return result;
};


export const  UserServices = {
    creteUserInDB
}