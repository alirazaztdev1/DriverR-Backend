//
import SuperAdmin from '../models/superAdmin.schema.js';
import { hashPassword, comparePassword } from '../utilities/bcrypt.js';
import { generateAuthToken } from '../utilities/authentication.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import Job from '../models/job.schema.js';

import message from '../constants/message.constant.js';
import Company from '../models/company.schema.js';
import Auth from '../models/auth.schema.js';
import Driver from '../models/driver.schema.js';

import sendEmail from '../utilities/mail.utility.js';

import * as jobService from '../services/job.service.js';

import { generateOTP } from '../utilities/common.utility.js';

import * as paymentService from '../services/payment.service.js';

import {
  companyNotificationText,
  driverNotificationText,
  generateCompanyNotification,
  generateDriverNotification,
} from '../constants/notification.constant.js';

import { profileStatusEnum } from '../enums/statusType.enum.js';

const createDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME;

  let admin = await SuperAdmin.findOne({ email });

  if (admin) {
    return;
  }
  let admins = await SuperAdmin.find();
  if (admins.length > 0) {
    return;
  }

  const hashedPassword = await hashPassword(password);

  admin = await new SuperAdmin({
    username,
    email,
    password: hashedPassword,
  });

  await admin.save((error) => {
    if (error) throw error;
  });
};

const login = async (req) => {
  const { email, password } = req.body;
  let admin = await SuperAdmin.findOne({ email });
  if (!admin) {
    return {
      status: false,
      message: message.ADMIN_NOT_FOUND,
    };
  }
  const isValidPassword = await comparePassword(password, admin.password);
  if (!isValidPassword) {
    return {
      status: false,
      message: message.INVALID_PASSWORD,
    };
  }

  const accessToken = await generateAuthToken({
    id: admin._id,
  });
  return {
    data: { admin, accessToken },
    status: true,
    message: message.ADMIN_SIGN_IN_SUCCESS,
  };
};

const viewJobById = async (req) => {
  try {
    const { jobId } = req.query;
    const data = await jobService.findAndPopulate(jobId, 'jobId');
    if (!data) {
      return {
        status: false,
        message: message.JOB_NOT_FOUND,
      };
    }
    return {
      status: true,
      data,
      message: message.JOB_DETAILS,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const activeInactiveCompany = async (req, type) => {
  try {
    const { companyId, isActive } = req.body;
    let company = await Company.findOne({ _id: companyId });

    if (company) {
      company.isActive = isActive;
      //

      await company.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('status updated successfully');
        }
      });

      return {
        status: true,
        data: company,
        message: 'Status updated successful ly',
      };
    } else {
      return {
        status: false,
        message: 'Comapny Not Found',
      };
    }
  } catch (error) {
    console.log({ error });
  }
};

const activeInactiveDriver = async (req, type) => {
  try {
    const { driverId, isActive } = req.body;
    let driver = await Driver.findOne({ _id: driverId });

    if (driver) {
      driver.isActive = isActive;
      //

      await driver.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('status updated successfully');
        }
      });

      return {
        status: true,
        data: driver,
        message: 'Status updated successful ly',
      };
    } else {
      return {
        status: false,
        message: 'Driver Not Found',
      };
    }
  } catch (error) {
    console.log({ error });
  }
};

const removeDriverById = async (req) => {
  try {
    const { driverId } = req.body;

    const driver = await Driver.findOne({ _id: driverId });

    if (driver) {
      await Driver.remove({ _id: driverId });
      const company = await findByUserId(driver.userId);
      if (company) {
        return {
          status: true,
          message: message.DRIVER_REMOVED_SUCCESS,
        };
      }
      const auth = await Auth.findOne({ _id: driver.userId });
      await Auth.remove({ _id: auth._id });
      return {
        status: true,
        message: message.DRIVER_REMOVED_SUCCESS,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const viewRegisteredCompanies = async (req) => {
  try {
    const { blocked } = req.query;
    let companies = '';
    if (blocked) {
      companies = await Company.find({ profileStatus: 'BLOCK' }).populate(
        'userId'
      );
    } else {
      companies = await Company.find({
        profileStatus: { $ne: 'BLOCK' },
      }).populate('userId');
    }

    if (!companies) {
      return {
        status: false,
        message: message.NO_COMPANY_EXIST,
      };
    }
    return {
      status: true,
      data: companies,
      message: message.COMPANIES_DATA,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message ? error.message : error,
    };
  }
};

const viewAllDrivers = async (req) => {
  try {
    const { blocked } = req.query;
    let drivers = '';
    if (blocked) {
      drivers = await Driver.find({ profileStatus: 'BLOCK' }).populate(
        'userId'
      );
    } else {
      drivers = await Driver.find({
        profileStatus: { $ne: 'BLOCK' },
      }).populate('userId');
    }

    if (!drivers) {
      return {
        status: false,
        message: message.NO_DRIVERS_EXIST,
      };
    }

    return {
      status: true,
      data: drivers,
      message: message.DRIVERS_DATA,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message ? error.message : error,
    };
  }
};

const removeJobById = async (req) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findOne({ _id: jobId });

    if (!job) {
      return {
        status: false,
        message: message.JOB_NOT_FOUND,
      };
    }

    await Job.remove({ _id: jobId });

    return {
      status: true,
      message: message.JOB_REMOVED_SUCCESS,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message ? error.message : error,
    };
  }
};

const viewAllJobs = async (req) => {
  try {
    const jobs = await Job.find().populate('companyId');
    if (!jobs) {
      return {
        status: false,
        message: message.NO_JOBS_EXIST,
      };
    }

    return {
      status: true,
      data: jobs,
      message: message.JOBS_DETAILS,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const removeCompanyById = async (req) => {
  try {
    const { companyId } = req.body;
    const company = await Company.findOne({ _id: companyId });

    if (company) {
      await Company.remove({ _id: companyId });
      const driver = await findByUserId(company.userId);
      if (driver) {
        return {
          status: true,
          message: message.COMPANY_REMOVED_SUCCESS,
        };
      }
      const auth = await Auth.findOne({ _id: company.userId });
      if (auth) {
        await Auth.remove({ _id: auth._id });
      } else {
        return {
          status: false,
          message: 'User Not Found',
        };
      }
    } else {
      return {
        status: false,
        message: message.COMPANY_NOT_FOUND,
      };
    }
    return {
      status: true,
      message: message.COMPANY_REMOVED_SUCCESS,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const activateJob = async (req) => {
  try {
    const { id, isActive } = req.body;
    let job = await Job.findOne({ _id: id });

    if (!job) {
      return {
        status: false,
        message: message.JOB_NOT_FOUND,
      };
    }

    job.isActive = isActive;
    await job.save();
    return {
      status: true,
      data: job,
      message: `Job ${isActive ? 'activated' : 'inactivated'} successfully`,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message ? error.message : error,
    };
  }
};

const adminChangePassword = async (req, res) => {
  const { email, currentPassword, newPassword, confirmNewPassword } = req.body;
  try {
    let admin = await findByEmail(email);
    if (!admin) {
      return {
        status: false,
        message: message.ADMIN_NOT_FOUND,
      };
    }
    const checkPassword = await comparePassword(
      currentPassword,
      admin.password
    );
    if (!checkPassword) {
      return {
        status: false,
        message: message.INVALID_PASSWORD,
      };
    }
    if (newPassword !== confirmNewPassword) {
      return {
        status: false,
        message: message.CONFIRM_PASSWORD_NOT_MATCH,
      };
    }
    const hashedPassword = await hashPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();
    return {
      status: true,
      message: message.PASSWORD_CHANGE_SUCCESS,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const manageDriverProfile = async (req) => {
  try {
    const {
      driverId,
      profileStatus,
      causeOfRejectionTitle,
      causeOfRejectionDescription,
    } = req.body;
    const driver = await Driver.findOne({ _id: driverId }); // Auth

    if (driver) {
      if (profileStatus === profileStatusEnum.REJECT) {
        if (!causeOfRejectionTitle || !causeOfRejectionDescription) {
          return {
            status: false,
            message:
              'Please Provide both the reason and the description for Rejection',
          };
        }

        generateDriverNotification(
          driverNotificationText.DRIVER_PROFILE_APPROVE_TITLE,
          driverNotificationText.DRIVER_PROFILE_APPROVE_MESSAGE,
          driverId
        );
        driver.causeOfRejection = {
          title: causeOfRejectionTitle,
          description: causeOfRejectionDescription,
        };
      }
      if (profileStatus === profileStatusEnum.APPROVE) {
        generateDriverNotification(
          driverNotificationText.DRIVER_PROFILE_APPROVE_TITLE,
          driverNotificationText.DRIVER_PROFILE_APPROVE_MESSAGE,
          driverId
        );
        driver.causeOfRejection = null;
      }
      if (
        profileStatus === profileStatusEnum.PENDING ||
        profileStatus === profileStatusEnum.BLOCK
      ) {
        driver.causeOfRejection = null;
      }
      driver.profileStatus = profileStatus;
      await driver.save();

      const data = await findByUserId(driver.id);
      return {
        status: true,
        data,
        message: `Driver profile ${profileStatus} successfully`,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error.message,
    };
  }
};
const manageCompanyProfile = async (req) => {
  try {
    const {
      companyId,
      profileStatus,
      causeOfRejectionTitle,
      causeOfRejectionDescription,
    } = req.body;

    const company = await Company.findOne({ _id: companyId }); // Auth
    if (company) {
      if (profileStatus === profileStatusEnum.REJECT) {
        if (!causeOfRejectionTitle || !causeOfRejectionDescription) {
          return {
            status: false,
            message:
              'Please provide a reason and description for cause of rejection',
          };
        }

        generateCompanyNotification(
          companyNotificationText.COMPANY_PROFILE_REJECT_TITLE,
          companyNotificationText.COMPANY_PROFILE_APPROVE_MESSAGE,
          companyId
        );
        company.causeOfRejection = {
          title: causeOfRejectionTitle,
          description: causeOfRejectionDescription,
        };
      }
      if (profileStatus === profileStatusEnum.APPROVE) {
        generateCompanyNotification(
          companyNotificationText.COMPANY_PROFILE_APPROVE_TITLE,
          companyNotificationText.COMPANY_PROFILE_APPROVE_MESSAGE,
          companyId
        );
        //

        company.causeOfRejection = null;
      }
      if (
        profileStatus === profileStatusEnum.PENDING ||
        profileStatus === profileStatusEnum.BLOCK
      ) {
        company.causeOfRejection = null;
      }
      company.profileStatus = profileStatus;
      await company.save();

      const data = await findByUserId(company.id);
      return {
        status: true,
        data: data ? data : '',
        message: `Company profile ${profileStatus} successfully`,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error.message,
    };
  }
};

const forgetPassword = async (req) => {
  const { email } = req.body;
  const code = generateOTP();
  try {
    const admin = await SuperAdmin.findOne({ email });
    if (admin) {
      admin.passwordVerificationCode = code;
      admin.save();
      await sendEmail(email, code);
      return { status: true, message: message.EMAIL_SENT_SUCCESS };
    } else {
      return {
        status: false,
        message: message.ADMIN_NOT_FOUND,
      };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const resetPassword = async (req) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return { status: false, message: message.ADMIN_NOT_FOUND };
    }
    if (superAdmin.passwordVerificationCode.length > 0) {
      return { status: false, message: message.VERIFICTAION_CODE_NOT_VERIFIED };
    }
    if (newPassword !== confirmPassword) {
      return { status: false, message: message.CONFIRM_PASSWORD_NOT_MATCH };
    }

    const hashedPassword = await hashPassword(newPassword);
    superAdmin.password = hashedPassword;
    // superAdmin.passwordVerificationCode = '';

    await superAdmin.save();
    return {
      status: true,
      message: message.PASSWORD_CHANGE_SUCCESS,
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const verifyEmailCode = async (req) => {
  const { email, passwordVerificationCode } = req.body;
  const admin = await SuperAdmin.findOne({ email });
  if (admin) {
    if (admin.passwordVerificationCode === passwordVerificationCode) {
      admin.passwordVerificationCode = '';
      admin.save();
      return { status: true, message: message.VERIFICTAION_CODE_VERIFIED };
    } else {
      return {
        status: false,
        message: message.RESET_PASSWORD_VERIFICATION_FAILED,
      };
    }
  } else {
    return { status: false, message: message.ADMIN_NOT_FOUND };
  }
};

const findByEmail = async (email) => {
  return await SuperAdmin.findOne({
    email,
  });
};

const findByUserId = async (userId) => {
  return await Driver.findOne({
    userId,
  });
};

const resetEmailVerify = async (req) => {
  try {
    const { password, email } = req.body;
    if (!email) {
      return { status: false, message: 'Please enter email' };
    }
    const admin = await SuperAdmin.findOne({ email });
    const match = await comparePassword(password, admin.password);
    // const admin = await SuperAdmin.findOne({ password });
    if (match) {
      admin.changeEmailVerification = true;
      await admin.save();
      return { status: true, message: 'Admin Verified' };
    }
    return { status: false, message: 'Admin Not Found' };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const updateEmail = async (req) => {
  try {
    const { previousEmail, newEmail, confirmEmail } = req.body;
    if (!previousEmail) {
      return { status: false, message: 'Please enter a previous email' };
    }
    const admin = await SuperAdmin.findOne({ email: previousEmail });
    if (newEmail !== confirmEmail) {
      return {
        status: false,
        message: 'New email and confirm email does not match',
      };
    }

    if (admin) {
      if (!admin.changeEmailVerification) {
        return {
          status: false,
          message: 'Please Verify your identity as admin',
        };
      }

      admin.email = newEmail;
      admin.changeEmailVerification = false;
      admin.save();
      return {
        status: true,
        message: 'Successfully updated email',
      };
    }
    return { status: false, message: 'Admin Not Found' };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const dashboardKPIs = async () => {
  try {
    const approvedDriversProfiles = await Driver.countDocuments({
      profileStatus: profileStatusEnum.APPROVE,
    });
    const pendingDriversProfiles = await Driver.countDocuments({
      profileStatus: profileStatusEnum.PENDING,
    });
    const approvedCompaniesProfiles = await Company.countDocuments({
      profileStatus: profileStatusEnum.APPROVE,
    });
    const pendingCompaniesProfiles = await Company.countDocuments({
      profileStatus: profileStatusEnum.PENDING,
    });
    const activeJobs = await Job.countDocuments({ isActive: true });
    const transactions = await paymentService.transactionList();

    return {
      status: true,
      message: 'Successfully got KPIs',
      data: {
        activeJobs,
        approvedDriversProfiles,
        pendingDriversProfiles,
        approvedCompaniesProfiles,
        pendingCompaniesProfiles,
        trxCount: transactions.data?.length,
      },
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};
const getLogo = async (req) => {
  try {
    const admins = await SuperAdmin.find();
    return {
      status: true,
      message: 'Successfully fetch logo',
      data: admins[0].logo,
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const removeCompanyApplications = async (req) => {
  try {
    const { companyIds } = req.body;
    if (companyIds.length > 0) {
      const removeCompanies = await Company.updateMany(
        { _id: { $in: companyIds } },
        { $set: { removeApplication: true } }
      );

      return {
        status: true,
        message: 'Successfully Removed',
        data: removeCompanies,
      };
    } else {
      return { status: false, message: 'None companies selected' };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};
const removeDriversApplications = async (req) => {
  try {
    const { driverIds } = req.body;
    if (driverIds.length > 0) {
      const removeDriver = await Driver.updateMany(
        { _id: { $in: driverIds } },
        { $set: { removeApplication: true } }
      );

      return {
        status: true,
        message: 'Successfully Removed',
        data: removeDriver,
      };
    } else {
      return { status: false, message: 'None companies selected' };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const addLogo = async (req) => {
  try {
    const admins = await SuperAdmin.find();
    const { logo } = req.body;
    if (!logo) {
      return { status: false, message: 'Please Provide logo' };
    }
    const admin = admins[0];
    admin.logo = logo;
    await admin.save();
    return { status: true, message: 'Logo added successfully' };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export {
  addLogo,
  getLogo,
  removeDriversApplications,
  dashboardKPIs,
  updateEmail,
  resetEmailVerify,
  manageCompanyProfile,
  verifyEmailCode,
  createDefaultAdmin,
  login,
  viewJobById,
  activeInactiveCompany,
  activeInactiveDriver,
  removeDriverById,
  viewRegisteredCompanies,
  viewAllDrivers,
  removeJobById,
  viewAllJobs,
  removeCompanyById,
  activateJob,
  adminChangePassword,
  manageDriverProfile,
  forgetPassword,
  resetPassword,
  removeCompanyApplications,
};
