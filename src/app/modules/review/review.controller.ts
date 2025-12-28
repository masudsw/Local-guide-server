import { Request, Response } from "express";

import httpStatus from "http-status";
import { ReviewService } from "./review.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
     const user = req.user!;
     console.log("inside controller---",req.body)
  const result = await ReviewService.createReview(
    user.id,
    user.role,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const getReviewsByListing = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewsByListing(req.params.listingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsByListing,
};
