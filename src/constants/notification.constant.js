import {
  AdminNotification,
  CompanyNotification,
  DriverNotification,
} from '../models/notification.schema.js';

const generateCompanyNotification = async (title, message, companyId) => {
  const companyNotification = new CompanyNotification({
    title,
    message,
    companyId,
  });
  await companyNotification.save();
};

const generateDriverNotification = async (title, message, driverId) => {
  const driverNotification = new DriverNotification({
    title,
    message,
    driverId,
  });
  await driverNotification.save();
};

const generateAdminNotification = async (title, message, adminId) => {
  const adminNotification = new AdminNotification({
    title,
    message,
    adminId,
  });
  await adminNotification.save();
};

const companyNotificationText = {
  COMPANY_PROFILE_APPROVE_TITLE: 'Profile',
  COMPANY_PROFILE_APPROVE_MESSAGE: 'Your profile has been approved',
  COMPANY_PROFILE_REJECT_TITLE: 'Profile',
  COMPANY_PROFILE_REJECT_MESSAGE:
    'Your Profile approve application has been  reject',
  COMPANY_RESET_PASSWORD_TITLE: 'Reset Password',
  COMPANY_RESET_PASSWORD_MESSAGE: 'You have reset your password',
  DRIVER_APPLY_FOR_JOB_APPLICATION_TITLE: 'Job Application',
  DRIVER_APPLY_FOR_JOB_APPLICATION_MESSAGE: (driverName, jobName) =>
    `${driverName} driver has applied for the ${jobName} post`,
  COMPANY_SCHEDULE_AN_INTERVIEW_WITH_DRIVER_TITLE: 'Interview Reminder',
  COMPANY_SCHEDULE_AN_INTERVIEW_WITH_DRIVER_MESSAGE: (driverName) =>
    `You have an interview with an ${driverName} driver after 15 minutes`,
  SCHEDULE_INTERVIEW_REMINDER_15_MINUTES_BEFORE_INTERVIEW_STARTING_TITLE:
    'Job Post',
  SCHEDULE_INTERVIEW_REMINDER_15_MINUTES_BEFORE_INTERVIEW_STARTING_MESSAGE:
    'Before 10 days of expiration',
  WHEN_A_JOB_POST_IS_IS_ABOUT_TO_EXPIRE_TITLE: 'Job Post',
  WHEN_A_JOB_POST_IS_IS_ABOUT_TO_EXPIRE_BEFORE_10_DAYS_MESSAGE:
    'Job post is about to expire in 10 days of expiration',
  WHEN_A_JOB_POST_IS_IS_ABOUT_TO_EXPIRE_BEFORE_3_DAYS_MESSAGE:
    'Job post is about to expire in 10 days of expiration',
  WHEN_A_JOB_POST_IS_IS_ABOUT_TO_EXPIRE_ON_THE_DAY_MESSAGE:
    'Job post is about to expire days of expiration',
  WHEN_A_SUBSCRIPTION_PLAN_IS_ABOUT_TO_EXPIRE: 'Subscription Plan',
  WHEN_A_SUBSCRIPTION_PLAN_IS_ABOUT_TO_EXPIRE_BEFORE_10_DAYS_MESSAGE:
    'Your subscription plan is about to expire in 10 days',
  WHEN_A_SUBSCRIPTION_PLAN_IS_ABOUT_TO_EXPIRE_BEFORE_3_DAYS_MESSAGE:
    'Your subscription plan is about to expire in 3 days',
  WHEN_A_SUBSCRIPTION_PLAN_IS_ABOUT_TO_EXPIRE_BEFORE_1_DAYS_MESSAGE:
    'Your subscription plan is about to expire in 1 day',
  WHEN_A_SUBSCRIPTION_PLAN_IS_ABOUT_TO_EXPIRE_ON_THE_DAY_MESSAGE:
    'Your subscription plan is about to expire',
  WHEN_THE_MAXIMUM_NUMBER_OF_DRIVERS_APPLY_TO_A_JOB_POST_TITLE: 'Job Post',
  WHEN_THE_MAXIMUM_NUMBER_OF_DRIVERS_APPLY_TO_A_JOB_POST_MESSAGE: (jobName) =>
    `The ${jobName} job post has reached its maximum limit`,
  WHEN_THE_SUPER_ADMIN_UPDATES_THE_THE_PRIVACY_POLICIES_TITLE:
    'TIRminator Application',
  WHEN_THE_SUPER_ADMIN_UPDATES_THE_THE_PRIVACY_POLICIES_MESSAGE:
    'TIRminator has updated its privacy policies',
  WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_TITLE: 'Support Center',
  WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_MESSAGE: (ticketNumber) =>
    `TIRminator has replied on the support ticket ${ticketNumber}`,
};
const driverNotificationText = {
  DRIVER_PROFILE_APPROVE_TITLE: 'Profile',
  DRIVER_PROFILE_APPROVE_MESSAGE: 'Your profile application is approved',
  DRIVER_PROFILE_REJECT_TITLE: 'Profile',
  DRIVER_PROFILE_REJECT_MESSAGE: 'Your profile application is rejected',

  WHEN_COMPANY_SHORTLIST_DRIVER_TITLE: 'You are shortlisted',
  WHEN_COMPANY_SHORTLIST_DRIVER_MESSAGE: (companyName, jobPost) =>
    `${companyName} company has shortlisted you on the ${jobPost} Job Post`,
  WHEN_COMPANY_SCHEDULE_AN_INTERVIEW_DRIVER_TITLE: 'Interview Schedule',
  WHEN_COMPANY_SCHEDULE_AN_INTERVIEW_DRIVER_MESSAGE: (companyName) =>
    `${companyName} company has scheduled the interview with you`,
  SCHEDULE_INTERVIEW_REMINDER_15_MINUTES_BEFORE_INTERVIEW_STARTING_TITLE:
    'Interview Reminder',
  SCHEDULE_INTERVIEW_REMINDER_15_MINUTES_BEFORE_INTERVIEW_STARTING_MESSAGE: (
    companyName
  ) => `You have an interview with ${companyName} company after 15 minutes`,
  WHEN_THE_COMPANY_SEND_MESSAGE_TO_DRIVER_TITLE: 'Message',
  WHEN_THE_COMPANY_SEND_MESSAGE_TO_DRIVER_MESSAGE: (companyName) =>
    `You have received a message from ${companyName} Company`,
  WHEN_THE_SUPER_ADMIN_UPDATES_THE_THE_PRIVACY_POLICIES_TITLE:
    'TIRminator Application',
  WHEN_THE_SUPER_ADMIN_UPDATES_THE_THE_PRIVACY_POLICIES_MESSAGE:
    'TIRminator has updated their privacy policies',
  WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_TITLE: 'Support Center',
  WHEN_THE_SUPER_ADMIN_REPLIES_TO_SUPPORT_QUERIES_MESSAGE: (
    ticketNumber = ''
  ) => `TIRminator has replied on the support ticket ${ticketNumber}`,
  //
};

const superAdminNotificationText = {
  WHEN_SUPER_ADMIN_RECEIVE_DRIVERS_PROFILE_APPLICATION_TITLE:
    'Driver Profile Application',
  WHEN_SUPER_ADMIN_RECEIVE_DRIVERS_PROFILE_APPLICATION_MESSAGE: (driverName) =>
    `You have received the ${driverName} driver profile application`,
  WHEN_SUPER_ADMIN_RECEIVE_COMPANY_PROFILE_APPLICATION_TITLE:
    'Company Profile Application',
  WHEN_SUPER_ADMIN_RECEIVE_COMPANY_PROFILE_APPLICATION_MESSAGE: (companyName) =>
    `You have received the ${companyName} company profile application`,
  WHEN_THE_DRIVER_SENDS_SUPPORT_QUERY_TITLE: 'Suppor Center',
  WHEN_THE_DRIVER_SENDS_SUPPORT_QUERY_MESSAGE: (driverName) =>
    `${driverName} driver has sent you the support query`,
  WHEN_THE_COMPANY_SENDS_SUPPORT_QUERY_TITLE: 'Suppor Center',
  WHEN_THE_COMPANY_SENDS_SUPPORT_QUERY_MESSAGE: (companyName) =>
    `${companyName} company has sent you the support query`,
  WHEN_A_COMPANY_BUYS_SUBSCRIPTION_PLAN_TITLE: 'Subscription Plan',
  WHEN_A_COMPANY_BUYS_SUBSCRIPTION_PLAN_MESSAGE: (companyName, planName) =>
    `${companyName} company has bought ${planName} plan`,
};

const companyDriverCommonNotification = {
  YOU_HAVE_RESET_PASSWORD_TITLE: 'Reset Password',
  RESET_HAVE_PASSWORD_MESSAGE: 'You have reset your password.',
};

export {
  generateAdminNotification,
  generateDriverNotification,
  generateCompanyNotification,
  companyNotificationText,
  driverNotificationText,
  superAdminNotificationText,
  companyDriverCommonNotification,
};
