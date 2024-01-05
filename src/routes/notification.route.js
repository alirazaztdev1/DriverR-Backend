import express from 'express';

import * as notificationsController from '../controllers/notifications.controller.js';
import { verifyAuthToken } from '../utilities/authentication.js';
const router = express.Router();

router.get('/get-all', verifyAuthToken(), notificationsController.getAll);
router.get(
  '/get-all-specific-user',
  verifyAuthToken(),
  notificationsController.getAllForSpecificUser
);
router.get(
  '/unread-length',
  verifyAuthToken(),
  notificationsController.markAsUnreadLength
);

router.put(
  '/mark-as-read',
  verifyAuthToken(),
  notificationsController.markAsRead
);

router.get(
  '/get-all-admin-notification',
  verifyAuthToken(),
  notificationsController.getAllAdminNotifications
);

export { router };
