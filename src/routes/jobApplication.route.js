import express from 'express';
import * as jobApplicationController from '../controllers/jobApplication.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.post(
  '/create',
  verifyAuthToken(),
  jobApplicationController.createJobApplication
);

router.put(
  '/update/:id',
  verifyAuthToken(),
  jobApplicationController.updateJobApplication
);

router.get(
  '/view-job-application',
  verifyAuthToken(),
  jobApplicationController.viewJobApplication
);

router.get(
  '/view-by-job',
  verifyAuthToken(),
  jobApplicationController.viewApplicationsByJob
);

router.get(
  '/view-by-company',
  verifyAuthToken(),
  jobApplicationController.viewApplicationsByCompany
);

router.get(
  '/view-by-driver',
  verifyAuthToken(),
  jobApplicationController.viewApplicationsByDriver
);

router.post(
  '/add-to-shotlist',
  verifyAuthToken(),
  jobApplicationController.addToShortlist
);

export { router };
