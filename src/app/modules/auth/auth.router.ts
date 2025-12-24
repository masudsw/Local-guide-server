import express, { NextFunction, Request, Response } from "express"
import { AuthController } from "./auth.controller";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// Public (Tourist + Guide)
router.post(
  "/register-user",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    if (req.body) {
      req.body = AuthValidation.registerUserSchema.parse(JSON.parse(req.body.data));
    }
    return AuthController.registerUser(req, res, next);
  }
);
// Admin only
router.post(
  "/register-admin",
  fileUploader.upload.single('file'),
  auth(Role.ADMIN),
  AuthController.registerAdmin
);

router.post(
  "/login",
  AuthController.login
)
export const authRouter = router;