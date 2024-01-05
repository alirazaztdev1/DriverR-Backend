import express from 'express';
import * as privacyPolicyController from '../controllers/privacy-policy.controller.js';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.get('/view', verifyAuthToken(), privacyPolicyController.view);

export { router };
