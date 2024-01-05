import express from 'express';
import * as shortlistController from '../controllers/shortlist.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.get('/add', verifyAuthToken(), shortlistController.addToShortlist);
router.get(
  '/remove',
  verifyAuthToken(),
  shortlistController.removeFromShortlist
);
router.get(
  '/view-by-job',
  verifyAuthToken(),
  shortlistController.viewShortlistedByJob
);
router.get(
  '/view-by-company',
  verifyAuthToken(),
  shortlistController.viewShortlistedByCompany
);
router.get(
  '/view-by-driver',
  verifyAuthToken(),
  shortlistController.viewShortlistedByDriver
);

export { router };
