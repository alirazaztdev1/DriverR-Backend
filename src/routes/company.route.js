import express from 'express';
import * as companyController from '../controllers/company.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.post('/profile', verifyAuthToken(), companyController.updateProfile);
router.get(
  '/view-driver-profile',
  verifyAuthToken(),
  companyController.viewDriverProfile
);
router.get('/get-profile', verifyAuthToken(), companyController.viewProfile);
router.post(
  '/select-language',
  verifyAuthToken(),
  companyController.updateProfile
);
router.get(
  '/top-hiring-companies',
  verifyAuthToken(),
  companyController.topHiringCompanies
);
router.get(
  '/get-all-companies',
  verifyAuthToken(),
  companyController.getAllCompanies
);

// router.use('/subscription', verifyAuthToken(), subscriptionRoutes.router);

export { router };
