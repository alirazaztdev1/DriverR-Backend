import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

// router.post('/create', verifyAuthToken(), paymentController.create);
router.put('/edit/:id', verifyAuthToken(), paymentController.updateProduct);
router.get(
  '/view-all-products',
  verifyAuthToken(),
  paymentController.viewAllProducts
);
router.get(
  '/view-all-addons',
  verifyAuthToken(),
  paymentController.viewAllAddons
);
router.get(
  '/get-customer-subscription',
  verifyAuthToken(),
  paymentController.getCustomerSubscription
);
router.post(
  '/checkout-session',
  verifyAuthToken(),
  paymentController.createCheckoutSession
);
router.get(
  '/transactions',
  verifyAuthToken(),
  paymentController.transactionList
);
// stripe webhook, payment success url and failed url
router.post('/webhook', paymentController.webhook);
router.get('/payment-success', paymentController.paymentSuccess);
router.get('/payment-failed', paymentController.paymentFailed);

export { router };
