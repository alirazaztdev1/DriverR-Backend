import express from 'express';
import * as jobController from '../controllers/job.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.post(
  '/create-or-update',
  verifyAuthToken(),
  jobController.createOrUpdate
);
router.get('/view', verifyAuthToken(), jobController.viewJob);
router.get(
  '/view-all-jobs-by-company',
  verifyAuthToken(),
  jobController.viewAllJobsByCompany
);
router.get(
  '/view-all-active-jobs',
  verifyAuthToken(),
  jobController.viewAllActiveJobs
);

export { router };
