import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../helper/jwtHelper";
import statusCode from "http-status"
import AppError from "../errors/apiError";

const auth=(...roles:string[])=>{
    return async(req:Request & {user?:any},res:Response,next:NextFunction)=>{
        try{
            const token=req.cookies.get("accessToken");
            if(!token){
                throw new AppError(statusCode.UNAUTHORIZED,"You are not logged in!")
            }
            const verifyUser=jwtHelper.verifyToken(token,"secret")
            req.user=verifyUser;
            if(roles.length && !roles.includes(verifyUser.role)){
                throw new AppError(statusCode.UNAUTHORIZED,"You are not authorized!!")
            }

        }catch(error){
            next(error)
        }
    }
}

export default auth;