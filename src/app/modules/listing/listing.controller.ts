import { Request, Response } from "express";
import { ListingService } from "./listing.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IUserPayload } from "../user/user.interface";

const createListing = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingService.createListing(req.user as IUserPayload,
        req.body,
        req.files as Express.Multer.File[]);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Listing created successfully",
        data: result
    });
});

const updateListing = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ListingService.updateListing(id,req.user as IUserPayload, req.body, req.files as Express.Multer.File[]);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Listing updated successfully",
        data: result
    });
});

const getAllListings = catchAsync(async (_req: Request, res: Response) => {
    const result = await ListingService.getAllListings();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Listings retrieved successfully",
        data: result
    });
});

const getListingById = catchAsync(async (req: Request, res: Response) => {
    const result = await ListingService.getListingById(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Listing retrieved successfully",
        data: result
    });
});

const deleteListing = catchAsync(async (req: Request, res: Response) => {
    await ListingService.deleteListing(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Listing deactivated",
        data: null
    });
});

export const ListingController = {
    createListing,
    getAllListings,
    getListingById,
    deleteListing,
    updateListing
};
