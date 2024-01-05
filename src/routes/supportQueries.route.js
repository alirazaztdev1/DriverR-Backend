import express from 'express';

import { verifyAuthToken } from '../utilities/authentication.js';

import * as supportQueriesController from '../controllers/supportQueries.controller.js';

const router = express.Router();

router.post('/send', verifyAuthToken(), supportQueriesController.send);
router.get(
  '/view-all',
  verifyAuthToken(),
  supportQueriesController.viewAllSupportQueries
);
router.get(
  '/all-user-queries/:userType/:id',
  verifyAuthToken(),
  supportQueriesController.allUserQueries
);
router.post(
  '/create-ticket',
  verifyAuthToken(),
  supportQueriesController.createTicket
);
router.put(
  '/update-status',
  verifyAuthToken(),
  supportQueriesController.updateStatus
);
router.get(
  '/conversation/:queryId',
  verifyAuthToken(),
  supportQueriesController.queryConversation
);
export { router };
