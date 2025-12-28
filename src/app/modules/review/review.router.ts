import express, { Request } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(Role.TOURIST),
  (req:Request,res,next)=>{console.log("inside review router",req.body); next()},
  validateRequest(ReviewValidation.createReview),
  ReviewController.createReview
);

router.get(
  "/:listingId",
  ReviewController.getReviewsByListing
);

export const ReviewRoutes = router;
