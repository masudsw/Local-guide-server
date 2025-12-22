import { Request, Response } from "express";
import { ListingService } from "./listing.service";

const createListing = async (req: Request, res: Response) => {
    const result = await ListingService.createListing(req.body);

    res.status(201).json({
        success: true,
        message: "Listing created successfully",
        data: result,
    });
};
const updateListing = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await ListingService.updateListing(id, req.body);

    res.status(200).json({
        success: true,
        message: "Listing updated successfully",
        data: result
    });
};

const getAllListings = async (_req: Request, res: Response) => {
    const result = await ListingService.getAllListings();

    res.status(200).json({
        success: true,
        data: result,
    });
};

const getListingById = async (req: Request, res: Response) => {
    const result = await ListingService.getListingById(req.params.id);

    res.status(200).json({
        success: true,
        data: result,
    });
};

const deleteListing = async (req: Request, res: Response) => {
    await ListingService.deleteListing(req.params.id);

    res.status(200).json({
        success: true,
        message: "Listing deactivated",
    });
};

export const ListingController = {
    createListing,
    getAllListings,
    getListingById,
    deleteListing,
    updateListing
};
