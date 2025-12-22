import { Router } from "express";

import validateRequest from "../../middlewares/validateRequest";


import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { AvailabilityController } from "./availability.controller";
import { AvailabilityValidation } from "./availability.validation";

const router = Router();

// GUIDE only
router.post(
  "/",
  auth(Role.GUIDE),
  validateRequest(AvailabilityValidation.createAvailabilitySchema),
  AvailabilityController.createAvailability
);

router.get(
  "/me",
  auth(Role.GUIDE),
  AvailabilityController.getMyAvailability
);

// Public (tourists)
router.get(
  "/guide/:guideId",
  validateRequest(AvailabilityValidation.getGuideAvailabilitySchema),
  AvailabilityController.getGuideAvailability
);

router.delete(
  "/:id",
  auth(Role.GUIDE),
  AvailabilityController.deleteAvailability
);

export const AvailabilityRouter = router;
