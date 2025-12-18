import express, { NextFunction, Request, Response } from "express"
import { SpecilitiesController } from "./specialities.controller";
import { fileUploader } from "../../helper/fileUploader";
import { SpecialitiesValidation } from "./specialities.validation";

const router = express.Router();
router.get(
    '/',
    SpecilitiesController.getAllFromDB
);
router.post(
    '/',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialitiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecilitiesController.insertIntoDB(req, res, next)
    }
)

export const SpecialtiesRoutes=router;