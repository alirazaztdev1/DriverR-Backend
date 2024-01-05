import express from 'express';
import dotenv from 'dotenv';
import * as faqsController from '../controllers/faqs.controller.js';
import { verifyAuthToken } from '../utilities/authentication.js';

dotenv.config();

const router = express.Router();

router.post('/add', verifyAuthToken(), faqsController.addFaq);
router.put('/edit/:id', verifyAuthToken(), faqsController.updateFaq);
router.get('/view-all', verifyAuthToken(), faqsController.viewAllFaqs);
router.delete('/remove', verifyAuthToken(), faqsController.removeFaq);
export { router };
