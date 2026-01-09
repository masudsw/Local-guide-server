import { NextFunction, Request, Response, Router } from "express";
import { updateProfileSchema, getUserByIdSchema, UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";

import { fileUploader } from "../../helper/fileUploader";
import { UserController } from "./user.controller";


const router = Router();

// Logged-in user
router.get("/me", auth(), UserController.getMyProfile);

router.patch(
  "/me",
  auth(),
  fileUploader.upload.single('file'), // Multer runs first to "fill" req.body
   (req: Request, res: Response, next: NextFunction) => {
      console.log(req.body)
      if (req.body) {
        req.body = UserValidation.updateProfileSchema.parse(JSON.parse(req.body.data));
      }
      return UserController.updateMyProfile(req, res, next);
    }
);
router.get("/",auth("ADMIN"), UserController.getAllUsers);

// Public profile
router.get(
  "/:id",
  UserController.getUserById
);
export const UserRouter=router;

