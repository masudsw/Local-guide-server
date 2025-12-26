import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { BookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  console.log(user)

  const result = await BookingService.createBooking(
    user.id,
    user.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;

  const result = await BookingService.getMyBookings(
    user.id,
    user.role
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const { bookingId } = req.params;

  const result = await BookingService.updateBookingStatus(
    user,
    bookingId,
    req.body.status
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking status updated",
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  updateBookingStatus,
};
