// src/app/modules/payment/payment.router.ts
import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

// Standard payment routes (e.g., initiating a payment) would go here
// router.post('/create-session', auth(), PaymentController.createSession);

export const PaymentRoutes = router;