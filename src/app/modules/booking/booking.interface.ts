import { BookingStatus } from "@prisma/client";

export interface ICreateBooking {
  listingId: string;
  date: string; // ISO date string
}

export interface IUpdateBookingStatus {
  status: BookingStatus;
}
