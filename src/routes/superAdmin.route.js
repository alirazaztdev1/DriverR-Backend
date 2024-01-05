import express from 'express';
import dotenv from 'dotenv';
import * as superAdminController from '../controllers/superAdmin.controller.js';
import { verifyAuthToken } from '../utilities/authentication.js';

import upload from '../middlewares/multer.js';
dotenv.config();

const router = express.Router();

router.get('/view-job', verifyAuthToken(), superAdminController.viewJobById);
router.put(
  '/active-inactive-company',
  verifyAuthToken(),
  superAdminController.activeInactiveCompany
);
router.put(
  '/active-inactive-driver',
  verifyAuthToken(),
  superAdminController.activeInactiveDriver
);
router.delete(
  '/remove-driver',
  verifyAuthToken(),
  superAdminController.removeDriverById
);
router.delete(
  '/remove-job',
  verifyAuthToken(),
  superAdminController.removeJobById
);
router.get(
  '/view-all-companies',
  verifyAuthToken(),
  superAdminController.viewRegisteredCompanies
);
router.get(
  '/view-all-drivers',
  verifyAuthToken(),
  superAdminController.viewAllDrivers
);
router.get(
  '/view-all-jobs',
  verifyAuthToken(),
  superAdminController.viewAllJobs
);
router.delete(
  '/remove-company',
  verifyAuthToken(),
  superAdminController.removeCompanyById
);
router.put(
  '/active-inactive-job',
  verifyAuthToken(),
  superAdminController.activateJob
);

router.put(
  '/manage-driver-profile',
  verifyAuthToken(),
  superAdminController.manageDriverProfile
);
router.put(
  '/manage-company-profile',
  verifyAuthToken(),
  superAdminController.manageCompanyProfile
);

router.get(
  '/dashboard-kpis',
  verifyAuthToken(),
  superAdminController.dashboardKPIs
);

router.delete(
  '/remove-companies-application',
  verifyAuthToken(),
  superAdminController.removeCompanyApplications
);

router.delete(
  '/remove-drivers-application',
  verifyAuthToken(),
  superAdminController.removeDriversApplications
);

router.post('/add-logo', verifyAuthToken(), superAdminController.addLogo);
router.get('/get-logo', verifyAuthToken(), superAdminController.getLogo);

export { router };
