import express from "express"
import { AuthController } from "./auth.controller";
import { registerUser, registerAdmin } from "./auth.controller";
import { Role } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import auth from "../../middlewares/auth";

const router = express.Router();

// Public (Tourist + Guide)
router.post(
  "/register",
  fileUploader.upload.single('file'),
  registerUser
);

// Admin only
router.post(
  "/register-admin",
  fileUploader.upload.single('file'),
  auth(Role.ADMIN),
  registerAdmin
);

router.post(
    "/login",
    AuthController.login
)
export const authRouter=router;