import express from 'express';
import * as interviewController from '../controllers/interview.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.post(
  '/create-schedule',
  verifyAuthToken(),
  interviewController.createSchedule
);

router.post('/reschedule', verifyAuthToken(), interviewController.reSchedule);

router.post(
  '/add-feedback',
  verifyAuthToken(),
  interviewController.addFeedback
);

router.get(
  '/remove-schedule',
  verifyAuthToken(),
  interviewController.removeSchedule
);

router.get(
  '/view-details',
  verifyAuthToken(),
  interviewController.viewSchedule
);

router.get(
  '/view-schedules-by-job',
  verifyAuthToken(),
  interviewController.viewSchedulesByJob
);

router.get(
  '/view-schedules-by-company',
  verifyAuthToken(),
  interviewController.viewSchedulesByCompany
);

router.get(
  '/view-schedules-by-driver',
  verifyAuthToken(),
  interviewController.viewSchedulesByDriver
);

export { router };
