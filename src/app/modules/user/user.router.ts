import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { updateProfileSchema, getUserByIdSchema } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";


const router = Router();

// Logged-in user
router.get("/me", auth(), UserController.getMyProfile);

router.patch(
  "/me",
  auth(),
  validateRequest(updateProfileSchema),
  UserController.updateMyProfile
);

// Public profile
router.get(
  "/:id",
  validateRequest(getUserByIdSchema),
  UserController.getUserById
);
export const UserRouter=router;

