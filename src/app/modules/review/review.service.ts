import { PrismaClient, BookingStatus, Role } from "@prisma/client";
import ApiError from "../../errors/apiError";
import httpStatus from "http-status";

const prisma = new PrismaClient();

const createReview = async (
    userId: string,
    role: Role,
    payload: {
        bookingId: string;
        rating: number;
        comment?: string;
    }
) => {
    // 1. Check Role
    if (role !== Role.TOURIST) {
        throw new ApiError(httpStatus.FORBIDDEN, "Only tourists can give reviews");
    }

    // 2. Fetch booking and check status/ownership in one go
    const booking = await prisma.booking.findUnique({
        where: {
            id: payload.bookingId,
        },
        select: {
            id: true,
            touristId: true,
            status: true,
            listingId: true,
        }
    });

    if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, "Booking record not found");
    }

    if (booking.touristId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot review a booking that isn't yours");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You can only review a tour after it has been marked as completed by the guide"
        );
    }

    // 3. Create the review
    // Note: If you have a @unique constraint on bookingId in your Review model,
    // Prisma will automatically prevent duplicates, but checking manually 
    // allows you to provide a much friendlier error message.

    const existingReview = await prisma.review.findUnique({
        where: { bookingId: payload.bookingId }
    });

    if (existingReview) {
        throw new ApiError(httpStatus.CONFLICT, "You have already submitted a review for this tour");
    }

    return await prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            userId, // The tourist
            listingId: booking.listingId,
            bookingId: booking.id,
        },
    });
};

const getReviewsByListing = async (listingId: string) => {
    return prisma.review.findMany({
        where: { listingId },
        include: {
            user: { select: { name: true, profilePhoto: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const ReviewService = {
    createReview,
    getReviewsByListing,
};
