import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import Job from '../models/job.schema.js';
import Company from '../models/company.schema.js';
import Driver from '../models/driver.schema.js';
import JobApplication from '../models/jobApplication.schema.js';
import * as jobApplicationService from './jobApplication.service.js';
import * as companyService from './company.service.js';
import * as driverService from './driver.service.js';
import message from '../constants/message.constant.js';
import Interview from '../models/interview.schema.js';

import {
  driverNotificationText,
  generateDriverNotification,
} from '../constants/notification.constant.js';

const createSchedule = async (req) => {
  try {
    const { jobApplicationId, driverId } = req.body;
    let jobApplication = await jobApplicationService.findById(jobApplicationId);
    if (!jobApplication) {
      return {
        status: false,
        message: message.JOB_APPLICATION_NOT_FOUND,
      };
    }
    if (!jobApplication.isShortlisted) {
      return {
        status: false,
        message: message.APPLICATION_NOT_SHORTLISTED,
      };
    }

    let interview = await findByJobAppId(jobApplicationId);
    if (interview) {
      interview = await findAndPopulate(jobApplicationId, 'jobAppId');
      return {
        status: false,
        data: interview,
        message: message.ALREADY_SCHEDULED,
      };
    }
    await JobApplication.updateOne(
      { _id: mongoose.Types.ObjectId(jobApplicationId) },
      { isInterviewScheduled: true }
    );
    await Interview.create(req.body);
    interview = await findAndPopulate(jobApplicationId, 'jobAppId');
    generateDriverNotification(
      driverNotificationText.WHEN_COMPANY_SCHEDULE_AN_INTERVIEW_DRIVER_TITLE,
      driverNotificationText.WHEN_COMPANY_SCHEDULE_AN_INTERVIEW_DRIVER_MESSAGE(
        jobApplication.companyId.name
      ),
      driverId
    );
    console.log(interview);

    return {
      status: true,
      data: interview,
      message: message.SCHEDULED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const reSchedule = async (req) => {
  try {
    const { jobApplicationId, scheduledAt, onlineInterviewLink } = req.body;
    let interview = await findByJobAppId(jobApplicationId);
    if (!interview) {
      return {
        status: false,
        message: message.SCHEDULE_NOT_FOUND,
      };
    }

    await Interview.updateOne(
      { jobApplicationId: mongoose.Types.ObjectId(jobApplicationId) },
      {
        scheduledAt,
        onlineInterviewLink,
      }
    );
    interview = await findAndPopulate(jobApplicationId, 'jobAppId');
    return {
      status: true,
      data: interview,
      message: message.RESCHEDULED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const addFeedback = async (req) => {
  try {
    const { jobApplicationId, feedback } = req.body;
    let interview = await findByJobAppId(jobApplicationId);
    if (!interview) {
      return {
        status: false,
        message: message.SCHEDULE_NOT_FOUND,
      };
    }

    await JobApplication.updateOne(
      { _id: mongoose.Types.ObjectId(jobApplicationId) },
      { isFeedbackAdded: true }
    );
    await Interview.updateOne(
      { jobApplicationId: mongoose.Types.ObjectId(jobApplicationId) },
      { feedback: feedback }
    );
    interview = await findAndPopulate(jobApplicationId, 'jobAppId');
    return {
      status: true,
      data: interview,
      message: message.FEEDBACK_ADDED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const removeSchedule = async (req) => {
  try {
    const { jobApplicationId } = req.query;
    let interview = await findByJobAppId(jobApplicationId);
    if (!interview) {
      return {
        status: false,
        message: message.SCHEDULE_NOT_FOUND,
      };
    }
    if (!interview.isActive) {
      return {
        status: false,
        message: message.ALREADY_REMOVED_SCHEDULE,
      };
    }
    await Interview.updateOne(
      { _id: mongoose.Types.ObjectId(jobApplicationId) },
      { isActive: false }
    );
    interview = await findByIdAndPopulate(jobApplicationId);
    return {
      status: true,
      data: interview,
      message: message.SCHEDULE_REMOVED_SUCCESSFULLY,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewSchedule = async (req) => {
  try {
    const { jobApplicationId } = req.query;
    const data = await findAndPopulate(jobApplicationId, 'jobAppId');
    if (data[0]) {
      return {
        status: true,
        data: data[0],
        message: message.INTERVIEW_SCHEDULE,
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

const viewSchedulesByJob = async (req) => {
  try {
    const { jobId } = req.query;
    const data = await findAndPopulate(jobId, 'jobId');
    return {
      status: true,
      data,
      message: message.JOB_INTERVIEW_SCHEDULES,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewSchedulesByCompany = async (req) => {
  try {
    const { companyId } = req.query;
    const data = await findAndPopulate(companyId, 'companyId');
    return {
      status: true,
      data,
      message: message.COMPANY_INTERVIEW_SCHEDULES,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewSchedulesByDriver = async (req) => {
  try {
    const { driverId } = req.query;
    const data = await findAndPopulate(driverId, 'driverId');
    return {
      status: true,
      data,
      message: message.DRIVER_INTERVIEW_SCHEDULES,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const findAndPopulate = async (id, findBy) => {
  let findObj = {
    jobApplicationId: mongoose.Types.ObjectId(id),
    isActive: true,
  };
  if (findBy === 'jobId') {
    findObj = {
      jobId: mongoose.Types.ObjectId(id),
      isActive: true,
    };
  } else if (findBy === 'companyId') {
    findObj = {
      companyId: mongoose.Types.ObjectId(id),
      isActive: true,
    };
  } else if (findBy === 'driverId') {
    findObj = {
      driverId: mongoose.Types.ObjectId(id),
      isActive: true,
    };
  }

  return await Interview.find(findObj).populate({
    path: 'jobApplicationId',
    populate: [
      {
        path: 'driverId',
        model: 'Driver',
      },
      {
        path: 'jobId',
        model: 'Job',
      },
      {
        path: 'companyId',
        model: 'Company',
      },
    ],
  });
};

const findById = async (jobApplicationId) => {
  return await JobApplication.findOne({
    _id: mongoose.Types.ObjectId(jobApplicationId),
  });
};

const findByJobAppId = async (jobApplicationId) => {
  return await Interview.findOne({
    jobApplicationId: mongoose.Types.ObjectId(jobApplicationId),
    isActive: true,
  });
};

const findByIdAndPopulate = async (jobApplicationId) => {
  return await JobApplication.findOne({
    _id: mongoose.Types.ObjectId(jobApplicationId),
    isActive: true,
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
  createSchedule,
  addFeedback,
  reSchedule,
  removeSchedule,
  viewSchedule,
  viewSchedulesByJob,
  viewSchedulesByCompany,
  viewSchedulesByDriver,
};
