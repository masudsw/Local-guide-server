import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { updateProfileSchema, getUserByIdSchema } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";


const router = Router();

// Logged-in user
router.get("/me", auth(), UserController.getMyProfile);

router.patch(
  "/me",
  auth(),
  fileUploader.upload.single('file'), // Multer runs first to "fill" req.body
  (req, res, next) => {
    console.log("--- Body Data in Router ---");
    console.log(req.body); 
    console.log("--- Files in Router ---");
    console.log(req.file);
    next(); // Move to the next middleware/controller
  },
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

