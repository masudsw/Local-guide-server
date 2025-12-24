
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { IUserPayload } from "../user/user.interface";
import { IListing, IUpdateListing } from "./listing.interface";

export const createListing = async (
    authenticatedUser: IUserPayload, // Passed from req.user
    payload: IListing,
    files: Express.Multer.File[]
) => {
    let targetGuideId: string;

    // 1. Logic for Role-based ID assignment
    if (authenticatedUser.role === Role.GUIDE) {
        // If a Guide is logged in, ALWAYS use their own ID to prevent spoofing
        targetGuideId = authenticatedUser.id;
    } else {
        // If an Admin is logged in, use the guideId provided in the payload
        // BUT we must verify it exists and belongs to a GUIDE
        const guide = await prisma.user.findUnique({
            where: { id: payload.guideId },
        });

        if (!guide || guide.role !== Role.GUIDE) {
            throw new Error("The provided guideId does not belong to a valid Guide");
        }
        targetGuideId = payload.guideId;
    }

    // 2. Handle Cloudinary Uploads
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
        const uploadResults = await Promise.all(
            files.map((file) => fileUploader.uploadToCloudinary(file))
        );
        imageUrls = uploadResults
            .filter((res) => res !== undefined)
            .map((res) => res!.secure_url);
    }

    // 3. Create the listing
    return prisma.listing.create({
        data: {
            ...payload,
            guideId: targetGuideId, // Use the verified/secured ID
            images: imageUrls,
        },
    });
};
export const updateListing = async (
  id: string,                 // The Listing ID
  authenticatedUser: IUserPayload, // The user from req.user
  payload: IUpdateListing,
  files: Express.Multer.File[]
) => {
  // 1. Build the "where" clause based on role
  // If ADMIN, they can update any listing. If GUIDE, they can only update their own.
  const whereCondition: any = { id };
  if (authenticatedUser.role === Role.GUIDE) {
    whereCondition.guideId = authenticatedUser.id;
  }

  // 2. Fetch the listing first to check ownership and get old images
  const existingListing = await prisma.listing.findUnique({
    where: whereCondition,
  });

  if (!existingListing) {
    throw new Error("Listing not found or you do not have permission to edit it");
  }

  let imageUrls: string[] = [];

  // 3. Handle Image Replacement
  if (files && files.length > 0) {
    // Delete old images
    if (existingListing.images && existingListing.images.length > 0) {
      const deletePromises = existingListing.images.map((url) => {
        const publicId = url.split("/").pop()?.split(".")[0];
        return publicId ? fileUploader.deleteFromCloudinary(publicId) : null;
      });
      await Promise.all(deletePromises);
    }

    // Upload new images
    const uploadResults = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file))
    );
    imageUrls = uploadResults
      .filter((res) => res !== undefined)
      .map((res) => res!.secure_url);
  }

  // 4. Perform the update
  return prisma.listing.update({
    where: { id },
    data: {
      ...payload,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    },
  });
};

const getAllListings = async () => {
    return prisma.listing.findMany({
        where: { isActive: true },
        include: {
            guide: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
};

const getListingById = async (id: string) => {
    return prisma.listing.findUnique({
        where: { id },
        include: {
            guide: true,
            reviews: true,
        },
    });
};

const deleteListing = async (id: string) => {
    return prisma.listing.update({
        where: { id },
        data: { isActive: false },
    });
};

export const ListingService = {
    createListing,
    getAllListings,
    getListingById,
    deleteListing,
    updateListing
};
