import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.post('/profile', verifyAuthToken(), driverController.updateProfile);
router.get(
  '/get-profile-details',
  verifyAuthToken(),
  driverController.viewProfile
);
router.post(
  '/select-language',
  verifyAuthToken(),
  driverController.updateProfile
);
router.get(
  '/get-all-drivers',
  verifyAuthToken(),
  driverController.getAllDrivers
);

export { router };
