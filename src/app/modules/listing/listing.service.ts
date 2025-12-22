
import { prisma } from "../../shared/prisma";
import { IListing, IUpdateListing } from "./listing.interface";

const createListing = async (payload: IListing) => {
    const guide = await prisma.user.findUnique({
        where: { id: payload.guideId },
    });

    if (!guide || guide.role !== "GUIDE") {
        throw new Error("Only guides can create listings");
    }

    return prisma.listing.create({
        data: payload,
    });
};
const updateListing = async (
    id: string,
    payload: IUpdateListing
) => {
    return prisma.listing.update({
        where: { id },
        data: payload
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
