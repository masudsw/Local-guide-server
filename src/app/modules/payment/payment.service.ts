import { BookingStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";

const updatePaymentStatus = async (
  bookingId: string, 
  transactionId: string, 
  gatewayData: any
) => {
  return await prisma.payment.update({
    where: { bookingId },
    data: {
      status: PaymentStatus.PAID,
      transactionId: transactionId,
      paymentGatewayData: gatewayData,
      // This is the "Nested Update" to the related Booking
      booking: {
        update: {
          status: BookingStatus.PAID, // Optional: updates the main booking flow
        },
      },
    },
    include: {
      booking: true, // Returns the updated booking object as well
    },
  });
};

export const PaymentService = {
  updatePaymentStatus,
};