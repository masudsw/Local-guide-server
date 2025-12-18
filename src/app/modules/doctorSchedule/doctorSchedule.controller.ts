import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../types/common";
import { DoctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB=catchAsync(async(req:Request & {user?:IJWTPayload}, res:Response)=>{
    const user=req.user;
    const result=await DoctorScheduleService.insertIntoDB(user as IJWTPayload, req.body);
    sendResponse(res,{
        statusCode:201,
        success:true,
        message:"Doctor schedule created successfully!",
        data:result
    })
});
export const DoctorScheduleController={
    insertIntoDB
}