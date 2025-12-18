import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { SpecialitiesService } from "./specialities.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status"


const insertIntoDB=catchAsync(async(req:Request,res:Response)=>{
    const result=await SpecialitiesService.insertIntoDB(req);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Specilities created successfully!",
        data:result
    });
});

const getAllFromDB=catchAsync(async(req:Request,res:Response)=>{
    const result=await SpecialitiesService.getAllFromDB();
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Specialities data fetched successfully",
        data:result
    });
});

const deleteFromDB=catchAsync(async(req:Request,res:Response)=>{
    const {id}=req.params;
    const result=await SpecialitiesService.deleteFromDB(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Speciality deleted successfully",
        data:result
    })
})
export const SpecilitiesController={
    insertIntoDB,
    getAllFromDB,
    deleteFromDB
}