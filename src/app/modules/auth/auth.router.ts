import express from "express"
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
  validateRequest(AuthValidation.registerUser),
  AuthController.registerUser
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
export const authRouter=router;