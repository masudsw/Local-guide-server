import { Request, Response } from 'express';
import Stripe from 'stripe';
import config from '../../../config';
import { PaymentService } from './payment.service';
import httpStatus from 'http-status';

const stripe = new Stripe(config.stripe_secret_key!);

const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // This MUST be the raw body
      sig, 
      config.stripe_webhook_secret!
    );
  } catch (err: any) {
    return res.status(httpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    console.log("Processing Webhook for Booking:", bookingId);

  if (!bookingId) {
    console.error("❌ No bookingId found in session metadata!");
    return res.status(400).send("No bookingId in metadata");
  }

    if (bookingId) {
      await PaymentService.updatePaymentStatus(bookingId, session.id, session);
    }
  }

  res.status(httpStatus.OK).json({ received: true });
};

export const PaymentController = {
  handleWebhook,
};