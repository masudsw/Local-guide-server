import { Role, UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcrypt"
import { jwtHelper } from "../../helper/jwtHelper"
import statusCode from "http-status"
import AppError from "../../errors/apiError"
import { fileUploader } from "../../helper/fileUploader"
import { Request } from "express"


const registerUser=async(req:Request)=>{
    const { name, email, password, role, expertise, dailyRate } = req.body;

    if (role === Role.ADMIN) {
    throw new Error("Admin registration is not allowed here");
  }

  let profilePhoto: string | undefined;
    if(req.file){
        const uploadResult=await fileUploader.uploadToCloudinary(req.file)
        profilePhoto = uploadResult?.secure_url;
    }
    const hashedPassword=await bcrypt.hash(req.body.password,10)

}
const registerAdmin=async(req:Request)=>{

}

const login=async(payload:{email:string, password:string})=>{
    const user=await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    })
    const isCorrectPassword=await bcrypt.compare(payload.password,user.password);
    if(!isCorrectPassword){
        throw new AppError(statusCode.BAD_REQUEST,"Password is incorrect");
    }
    const accessToken=jwtHelper.generateToken({email:user.email, role:user.role},"secret","1h");
    const refreshToken=jwtHelper.generateToken({email:user.email, role:user.role},"very very secreat","90d")
    return{
        accessToken,
        refreshToken,
        needPasswordChange:user.needPasswordChange
    }
}

export const AuthService={
    login
}