import express from 'express';
import * as userController from '../controllers/auth.controller.js';
import dotenv from 'dotenv';
import { validatePasssword } from '../utilities/validation.js';
import { passwordValidation } from '../middlewares/validations.js';

import * as superAdminController from '../controllers/superAdmin.controller.js';
import { verifyAuthToken } from '../utilities/authentication.js';
dotenv.config();

const router = express.Router();

router.get('/get-all', userController.getAll);
router.post('/register-with-phone', userController.registerWithPhone);
router.post('/resend-otp', userController.resendOTP);
router.post('/verify-otp', userController.verifyOTP);
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.put(
  '/change-password',
  validatePasssword,
  passwordValidation,
  userController.changePassword
);

// recover forget password flow through otp
router.post('/forget-password', userController.forgetPassword);
router.post('/verify-reset-otp', userController.verifyOTP);
router.post(
  '/reset-password',
  validatePasssword,
  passwordValidation,
  userController.resetForgetPassword
);

router.post('/admin/login', superAdminController.login);
router.post('/admin/forget-password', superAdminController.forgetPassword);
router.put(
  '/admin/reset-password',
  validatePasssword,
  passwordValidation,
  superAdminController.resetPassword
);

router.put(
  '/admin/change-password',
  verifyAuthToken(),
  validatePasssword,
  passwordValidation,
  superAdminController.adminChangePassword
);

router.post(
  '/admin/verify-email-code',
  verifyAuthToken(),
  superAdminController.verifyEmailCode
);
router.post(
  '/admin/reset-email-verify',
  verifyAuthToken(),
  superAdminController.resetEmailVerify
);
router.put(
  '/admin/update-email',
  verifyAuthToken(),
  superAdminController.updateEmail
);
export { router };
