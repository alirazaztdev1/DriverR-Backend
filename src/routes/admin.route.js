import express from 'express';
import * as paymentRoutes from './payment.route.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

// router.use('/plans', paymentRoutes.router);

export { router };
