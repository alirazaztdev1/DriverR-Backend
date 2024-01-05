import express from 'express';
import * as websiteController from '../controllers/website.controller.js';

import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
router.post('/send-email', websiteController.sendEmail);
export { router };
