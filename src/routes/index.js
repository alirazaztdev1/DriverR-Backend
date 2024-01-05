import express from 'express';

import * as authRoutes from './auth.route.js';
import * as companyRoutes from './company.route.js';
import * as driverRoutes from './driver.route.js';
import * as jobRoutes from './job.route.js';
import * as jobApplicationRoutes from './jobApplication.route.js';
import * as shorlistRoutes from './shortlist.route.js';
import * as interviewRoutes from './interview.route.js';
import * as adminRoutes from './admin.route.js';
import * as privacyPolicyRoutes from './privacy-policy.route.js';
import * as superAdminRoutes from './superAdmin.route.js';
import * as faqsRoutes from './faqs.route.js';
import * as paymentRutes from './payment.route.js';
import * as supportQueryRoutes from './supportQueries.route.js';
import * as notificationRoutes from './notification.route.js';
import * as chatRoutes from './chat.route.js';
import * as imageRoutes from './image.route.js';
import * as websiteRoutes from './website.route.js';

const router = express.Router();

router.use('/auth', authRoutes.router);
router.use('/company', companyRoutes.router);
router.use('/driver', driverRoutes.router);
router.use('/job', jobRoutes.router);
router.use('/job-application', jobApplicationRoutes.router);
router.use('/shortlist', shorlistRoutes.router);
router.use('/interview', interviewRoutes.router);
router.use('/admin', adminRoutes.router);
router.use('/privacy-policy', privacyPolicyRoutes.router);
router.use('/super-admin', superAdminRoutes.router);
router.use('/faqs', faqsRoutes.router);
router.use('/support-queries', supportQueryRoutes.router);
router.use('/notification', notificationRoutes.router);
router.use('/payment', paymentRutes.router);
router.use('/chat', chatRoutes.router);
router.use('/image', imageRoutes.router);
router.use('/website', websiteRoutes.router);

export { router };
