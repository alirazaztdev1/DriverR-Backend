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
  companyNotificationText,
  generateCompanyNotification,
} from '../constants/notification.constant.js';
import { Subscription } from '../models/subscription.schema.js';

const createJobApplication = async (req) => {
  try {
    const { jobId, companyId, driverId } = req.body;
    const job = await jobService.findById(jobId);
    const company = await companyService.findById(companyId);
    const driver = await driverService.findById(driverId);

    const companySub = await Subscription.findOne({
      companyId,
      isActive: true,
    });

    if (!companySub) {
      return {
        status: false,
        message: `No longer accepting the applications`,
      };
    }

    if (!job) {
      return {
        status: false,
        message: message.JOB_NOT_FOUND,
      };
    }
    if (!company) {
      return {
        status: false,
        message: message.COMPANY_NOT_FOUND,
      };
    }
    if (!driver) {
      return {
        status: false,
        message: message.DRIVER_NOT_FOUND,
      };
    }

    if (company.totalJobApplicationsAllowed <= job.numApplications) {
      return {
        status: false,
        message: `No longer accepting the applications`,
      };
    }

    if (job.isActive) {
      const _jobApplication = await findJobApplication(
        job.id,
        company.id,
        driver.id
      );
      if (_jobApplication) {
        return {
          status: false,
          message: message.ALREADY_APPLIED,
        };
      }
      let jobApplication = await JobApplication.create(req.body);

      await Job.updateOne(
        { _id: mongoose.Types.ObjectId(job.id) },
        {
          // isUpdatable: false,
          $inc: { numApplications: 1 },
        }
      );
      await Company.updateOne(
        { _id: mongoose.Types.ObjectId(companyId) },
        { $inc: { numJobApplications: 1 } }
      );
      await Driver.updateOne(
        { _id: mongoose.Types.ObjectId(driverId) },
        { $inc: { numApplications: 1 } }
      );
      generateCompanyNotification(
        companyNotificationText.DRIVER_APPLY_FOR_JOB_APPLICATION_TITLE,
        companyNotificationText.DRIVER_APPLY_FOR_JOB_APPLICATION_MESSAGE(
          `${driver.firstName} ${driver.lastName}`,
          job.title
        ),
        companyId
      );

      return {
        status: true,
        data: jobApplication,
        message: message.APPLY_SUCCESS,
      };
    } else {
      return {
        status: false,
        message: message.JOB_CLOSED,
      };
    }
  } catch (err) {
    console.log(
      `Error creating job application: `,
      err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const updateJobApplication = async (req) => {
  try {
    const jobApplicationId = req.params.id;
    let jobApplication = await findById(jobApplicationId);
    if (!jobApplication) {
      return {
        status: false,
        message: message.JOB_APPLICATION_NOT_FOUND,
      };
    }
    await JobApplication.updateOne(
      { _id: mongoose.Types.ObjectId(jobApplicationId) },
      req.body
    );
    jobApplication = await findAndPopulate(jobApplicationId);
    return {
      status: true,
      data: jobApplication,
      message: message.JOB_APP_UPDATE_SUCCESS,
    };
  } catch (err) {
    console.log(
      `Error updating job application: `,
      err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewJobApplication = async (req) => {
  try {
    const { jobApplicationId } = req.query;
    const data = await findAndPopulate(jobApplicationId, 'jobAppId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOB_APPLICATION_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.JOB_APPLICATION_NOT_FOUND,
      };
    }
  } catch (err) {
    console.log(
      `Error viewing job application: `,
      err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewApplicationsByJob = async (req) => {
  try {
    const { jobId } = req.query;
    const data = await findAndPopulate(jobId, 'jobId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOB_APPLICATIONS_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.NO_JOB_APPLICATIONS_FOUND,
      };
    }
  } catch (err) {
    console.log(
      `Error viewing applications by job: `,
      err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewApplicationsByCompany = async (req) => {
  try {
    const { companyId } = req.query;
    const data = await findAndPopulate(companyId, 'companyId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOB_APPLICATIONS_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.NO_JOB_APPLICATIONS_FOUND,
      };
    }
  } catch (err) {
    console.log(`Error viewing applications by company: ${err}`);
    return {
      status: false,
      message: err,
    };
  }
};

const viewApplicationsByDriver = async (req) => {
  try {
    const { driverId } = req.query;
    const data = await findAndPopulate(driverId, 'driverId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOB_APPLICATIONS_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.NO_JOB_APPLICATIONS_FOUND,
      };
    }
  } catch (err) {
    console.log(`Error viewing applications by company: ${err}`);
    return {
      status: false,
      message: err,
    };
  }
};

const findAndPopulate = async (id, findBy) => {
  // if (findBy == 'jobId') {
  //   return await JobApplication.find({
  //     jobId: mongoose.Types.ObjectId(id),
  //     isActive: true,
  //   }).populate('jobId companyId driverId');
  // } else if (findBy == 'companyId') {
  //   return await JobApplication.find({
  //     companyId: mongoose.Types.ObjectId(id),
  //     isActive: true,
  //   }).populate('jobId companyId driverId');
  // } else if (findBy == 'driverId') {
  //   return await JobApplication.find({
  //     driverId: mongoose.Types.ObjectId(id),
  //     isActive: true,
  //   }).populate('jobId companyId driverId');
  // } else {
  //   return await JobApplication.findOne({
  //     _id: mongoose.Types.ObjectId(id),
  //     isActive: true,
  //   }).populate('jobId companyId driverId');
  // }

  let query;

  if (findBy === 'jobId') {
    query = JobApplication.find({
      jobId: mongoose.Types.ObjectId(id),
      isActive: true,
    }).populate('jobId companyId driverId');
  } else if (findBy === 'companyId') {
    query = JobApplication.find({
      companyId: mongoose.Types.ObjectId(id),
      isActive: true,
    }).populate('jobId companyId driverId');
  } else if (findBy === 'driverId') {
    query = JobApplication.find({
      driverId: mongoose.Types.ObjectId(id),
      isActive: true,
    }).populate('jobId companyId driverId');
  } else {
    query = JobApplication.findOne({
      _id: mongoose.Types.ObjectId(id),
      isActive: true,
    }).populate('jobId companyId driverId');
  }

  // Attach phoneNumber from Auth schema to Driver schema
  query.populate({
    path: 'driverId',
    populate: {
      path: 'userId',
      select: 'phoneNumber',
    },
  });

  // Execute the query and return the result
  return await query.exec();
};

const findById = async (jobApplicationId) => {
  return await JobApplication.findOne({
    _id: mongoose.Types.ObjectId(jobApplicationId),
    isActive: true,
  });
};

const findJobApplication = async (jobId, companyId, driverId) => {
  return await JobApplication.findOne({
    jobId,
    companyId,
    driverId,
    isActive: true,
  });
};

export {
  createJobApplication,
  updateJobApplication,
  viewJobApplication,
  viewApplicationsByJob,
  viewApplicationsByCompany,
  viewApplicationsByDriver,
  findById,
};
