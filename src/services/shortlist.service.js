import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import Job from '../models/job.schema.js';
import Company from '../models/company.schema.js';
import Driver from '../models/driver.schema.js';
import JobApplication from '../models/jobApplication.schema.js';
import * as jobService from './job.service.js';
import * as companyService from './company.service.js';
import * as driverService from './driver.service.js';
import message from '../constants/message.constant.js';
import {
  driverNotificationText,
  generateDriverNotification,
} from '../constants/notification.constant.js';

const addToShortlist = async (req) => {
  try {
    const { jobApplicationId } = req.query;
    let jobApplication = await findById(jobApplicationId);
    if (!jobApplication) {
      return {
        status: false,
        message: message.JOB_APPLICATION_NOT_FOUND,
      };
    }
    if (jobApplication.isShortlisted) {
      return {
        status: false,
        message: message.ALREADY_SHORTLISTED,
      };
    }
    await JobApplication.updateOne(
      { _id: mongoose.Types.ObjectId(jobApplicationId) },
      { isShortlisted: true }
    );
    jobApplication = await findByIdAndPopulate(jobApplicationId);
    generateDriverNotification(
      driverNotificationText.WHEN_COMPANY_SHORTLIST_DRIVER_TITLE,
      driverNotificationText.WHEN_COMPANY_SHORTLIST_DRIVER_MESSAGE(
        jobApplication.companyId.name,
        jobApplication.jobId.title
      ),
      jobApplication.driverId._id
    );
    return {
      status: true,
      data: jobApplication,
      message: message.SHORTLISTED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const removeFromShortlist = async (req) => {
  try {
    const { jobApplicationId } = req.query;
    let jobApplication = await findById(jobApplicationId);
    if (!jobApplication) {
      return {
        status: false,
        message: message.JOB_APPLICATION_NOT_FOUND,
      };
    }
    if (jobApplication.isShortlisted == false) {
      return {
        status: false,
        message: message.ALREADY_REMOVED_FROM_SHORTLIST,
      };
    }
    await JobApplication.updateOne(
      { _id: mongoose.Types.ObjectId(jobApplicationId) },
      { isShortlisted: false }
    );
    jobApplication = await findByIdAndPopulate(jobApplicationId);
    return {
      status: true,
      data: jobApplication,
      message: message.SHORTLIST_REMOVED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewShortlistedByJob = async (req) => {
  try {
    const { jobId } = req.query;
    const data = await findAndPopulate(jobId, 'jobId');
    if (data) {
      return {
        status: true,
        data,
        message: message.SHORTLISTED_BY_JOB,
      };
    } else {
      return {
        status: false,
        message: message.NO_SHORTLISTED_APPLICATIONS_FOUND,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewShortlistedByCompany = async (req) => {
  try {
    const { companyId } = req.query;
    const data = await findAndPopulate(companyId, 'companyId');
    if (data) {
      return {
        status: true,
        data,
        message: message.SHORTLISTED_BY_COMPANY,
      };
    } else {
      return {
        status: false,
        message: message.NO_SHORTLISTED_APPLICATIONS_FOUND,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewShortlistedByDriver = async (req) => {
  try {
    const { driverId } = req.query;
    const data = await findAndPopulate(driverId, 'driverId');
    if (data) {
      return {
        status: true,
        data,
        message: message.SHORTLISTED_BY_DRIVER,
      };
    } else {
      return {
        status: false,
        message: message.NO_SHORTLISTED_APPLICATIONS_FOUND,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const findAndPopulate = async (id, findBy) => {
  if (findBy == 'jobId') {
    return await JobApplication.find({
      jobId: mongoose.Types.ObjectId(id),
      isShortlisted: true,
    }).populate('jobId companyId driverId');
  } else if (findBy == 'companyId') {
    return await JobApplication.find({
      companyId: mongoose.Types.ObjectId(id),
      isShortlisted: true,
    }).populate('jobId companyId driverId');
  } else if (findBy == 'driverId') {
    return await JobApplication.find({
      driverId: mongoose.Types.ObjectId(id),
      isShortlisted: true,
    }).populate('jobId companyId driverId');
  }
};

const findById = async (jobApplicationId) => {
  return await JobApplication.findOne({
    _id: mongoose.Types.ObjectId(jobApplicationId),
  });
};

const findByIdAndPopulate = async (jobApplicationId) => {
  return await JobApplication.findOne({
    _id: mongoose.Types.ObjectId(jobApplicationId),
  }).populate('jobId companyId driverId');
};

const findJobApplication = async (jobId, companyId, driverId) => {
  return await JobApplication.findOne({
    jobId,
    companyId,
    driverId,
  });
};

export {
  addToShortlist,
  removeFromShortlist,
  viewShortlistedByJob,
  viewShortlistedByCompany,
  viewShortlistedByDriver,
};
