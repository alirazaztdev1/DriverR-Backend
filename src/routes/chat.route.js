import express from 'express';

import * as chatController from '../controllers/chat.controller.js';
import { verifyAuthToken } from '../utilities/authentication.js';

const router = express.Router();

router.get(
  '/get-all-chats',
  verifyAuthToken(),
  chatController.getAllChatsByUser
);
router.get('/get-chat-by-id', verifyAuthToken(), chatController.getChatById);
router.get(
  '/get-chat-by-user-ids',
  verifyAuthToken(),
  chatController.getChatByUserIds
);
router.get('/block-unblock', verifyAuthToken(), chatController.blockUnblock);
router.get('/mark-as-read', verifyAuthToken(), chatController.markAsRead);
router.get(
  '/all-unread-count',
  verifyAuthToken(),
  chatController.allUnreadCount
);
export { router };
