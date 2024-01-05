import express from 'express';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../utilities/authentication.js';
import * as imageController from '../controllers/image.controller.js';
import upload from '../middlewares/multer.js';

dotenv.config();

const router = express.Router();

router.post('/upload', upload.single('image'), imageController.upload);

export { router };
