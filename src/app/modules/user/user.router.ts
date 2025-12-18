import express, { NextFunction, Request, Response } from "express"
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router=express.Router();
router.get(
    "/",
    auth(UserRole.ADMIN),
    UserController.getAllFromDB 
)
router.post(
    "/create-patient",
    fileUploader.upload.single('file'),
    (req:Request, res:Response, next:NextFunction)=>{
        req.body=UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req,res,next)
    }
)
router.post(
    "/create-admin",
    auth(UserRole.ADMIN),
    fileUploader.upload.single("file"),
    (req:Request,res:Response, next:NextFunction)=>{
        req.body=UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req,res,next)
    }
)

export const userRoutes=router