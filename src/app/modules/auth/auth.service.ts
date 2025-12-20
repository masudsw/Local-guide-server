import bcrypt from "bcrypt";

import { Role, UserStatus } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import AppError from "../../errors/apiError";
import httpStatus from "http-status"
import { jwtHelper } from "../../helper/jwtHelper";
import { email } from "zod";
import config from "../../../config";


export const registerUser = async (req: Request) => {
  const { name, email, password, role, expertise, dailyRate } = req.body;


  if (role === Role.ADMIN) {
    throw new Error("Admin registration is not allowed here");
  }

  let profilePhoto: string | undefined;

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    profilePhoto = uploadResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profilePhoto,
      guideProfile:
        role === Role.GUIDE
          ? {
              create: {
                expertise,
                dailyRate: Number(dailyRate),
                isVerified: false,
              },
            }
          : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const registerAdmin = async (req: Request) => {
  const { name, email, password } = req.body;

   let profilePhoto: string | undefined;

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    profilePhoto = uploadResult?.secure_url;
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      profilePhoto,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return admin;
};


const login=async(payload:{email:string, password:string})=>{
    const user=await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    })
    const isCorrectPassword=await bcrypt.compare(payload.password,user.password);
    if(!isCorrectPassword){
        throw new AppError(httpStatus.BAD_REQUEST,"Password incorrect")
    }
    const accessToken=jwtHelper.generateToken({email:user.email, role:user.role},config.access_token_secret as string,config.access_token_expires as string)
    const refreshToken=jwtHelper.generateToken({email:user.email,role:user.role},config.refresh_token_secret as string, config.refresh_token_expires as string)

    return{
        accessToken,
        refreshToken
    }
}




export const AuthService={
    registerAdmin,
    registerUser,
    login

}