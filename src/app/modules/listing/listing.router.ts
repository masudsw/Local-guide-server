import express, { NextFunction, Request, Response } from "express";
import { ListingController } from "./listing.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ListingValidation } from "./listing.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import { file } from "zod";

const router = express.Router();

router.post(
    "/",
    auth(Role.GUIDE, Role.ADMIN),
    fileUploader.upload.array('file',5),
    (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        if (req.body) {
            req.body = ListingValidation.createListingSchema.parse(JSON.parse(req.body.data));
        }
        return ListingController.createListing(req, res, next);
    }
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
    fileUploader.upload.array('file',5),
    (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        if (req.body) {
            req.body = ListingValidation.updateListingSchema.parse(JSON.parse(req.body.data));
        }
        return ListingController.updateListing(req, res, next);
    }
);

export const ListingRoutes = router;
