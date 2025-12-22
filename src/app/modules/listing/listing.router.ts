import express from "express";
import { ListingController } from "./listing.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ListingValidation } from "./listing.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post(
    "/",
    auth(Role.GUIDE, Role.ADMIN),
    validateRequest(ListingValidation.createListingSchema),
    ListingController.createListing
);

router.get("/", ListingController.getAllListings);
router.get("/:id", ListingController.getListingById);
router.delete(
    "/:id",
    auth(Role.ADMIN),
    ListingController.deleteListing
);
router.patch(
    "/:id",
    auth(Role.GUIDE, Role.ADMIN),
    validateRequest(ListingValidation.updateListingSchema),
    ListingController.updateListing
);

export const ListingRoutes = router;
