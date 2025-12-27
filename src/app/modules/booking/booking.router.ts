import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "@prisma/client";
import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

const router = express.Router();

router.post(
  "/",
  auth(Role.TOURIST),
  validateRequest(BookingValidation.createBooking),
  BookingController.createBooking
);

router.get(
  "/my-bookings",
  auth(Role.TOURIST),
  BookingController.getMyBookings
);
router.post(
  "/:bookingId/create-payment-session",
  auth(Role.TOURIST),
  BookingController.createPaymentSession
);
router.patch(
  "/:bookingId/status",
  auth(Role.GUIDE),
  validateRequest(BookingValidation.updateBookingStatus),
  BookingController.updateBookingStatus
);

router.patch(
  "/:bookingId/complete",
  auth(Role.GUIDE),
  BookingController.completeBooking
);


export const BookingRoutes = router;
