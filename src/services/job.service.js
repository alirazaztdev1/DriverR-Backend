import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import Job from '../models/job.schema.js';
import Company from '../models/company.schema.js';
import * as companyService from './company.service.js';
import message from '../constants/message.constant.js';
import JobApplication from '../models/jobApplication.schema.js';
import Interview from '../models/interview.schema.js';
import { generateJobId } from '../utilities/common.utility.js';
import { Subscription } from '../models/subscription.schema.js';

const createOrUpdate = async (req) => {
  try {
    const { companyId, jobId } = req.body;
    const company = await companyService.findById(companyId);
    if (!company) {
      return {
        status: false,
        message: `Company not found`,
      };
    }
    if (company) {
      let job = await findById(jobId);
      // if job exists, update it
      if (jobId && job) {
        if (job.isUpdatable) {
          // await Job.updateOne(
          //   { companyId: mongoose.Types.ObjectId(companyId), title: title },
          //   req.body
          // );
          await Job.updateOne(
            { _id: mongoose.Types.ObjectId(jobId) },
            req.body
          );

          // disable corresponding applications and interviews and all others related things
          await JobApplication.updateOne(
            { jobId: mongoose.Types.ObjectId(jobId) },
            { isActive: false }
          );
          await Interview.updateOne(
            { jobId: mongoose.Types.ObjectId(jobId) },
            { isActive: false }
          );
        } else {
          return {
            status: false,
            message: message.JOB_CANNOT_UPDATE,
          };
        }
        job = await findById(jobId);
        return {
          status: true,
          data: job,
          message: `Job updated successfully`,
        };
      } else {
        // create a new job
        const jobId = generateJobId();

        const companySub = await Subscription.findOne({
          companyId,
          isActive: true,
        });

        if (!companySub) {
          return {
            status: false,
            message: `Cannot post job. Buy a subscription plan to continue with posting jobs`,
          };
        }

        if (company.totalJobsAllowed <= company.numJobs) {
          return {
            status: false,
            message: `Cannot post new job. Maximum job posting limit reached`,
          };
        }
        job = await Job.create({ ...req.body, jobId });
        job.jobUrl = `tirminator-app://tirminator/${job._id}`;
        await job.save();
        await Company.updateOne(
          { _id: mongoose.Types.ObjectId(companyId) },
          { $inc: { numJobs: 1 } }
        );
        return {
          status: true,
          data: job,
          message: `Job created successfully`,
        };
      }
    }
  } catch (err) {
    console.log(
      'Error creating / updating job: ' + err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewJob = async (req) => {
  try {
    const { jobId } = req.query;
    const data = await findAndPopulate(jobId, 'jobId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOB_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.JOB_NOT_FOUND,
      };
    }
  } catch (err) {
    console.log(
      'Error viewing job by id: ' + err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewAllJobsByCompany = async (req) => {
  try {
    const { companyId } = req.query;
    const data = await findAndPopulate(companyId, 'companyId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOB_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.JOB_NOT_FOUND,
      };
    }
  } catch (err) {
    console.log(
      'Error viewing all jobs by company: ' + err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewAllActiveJobs = async (req) => {
  try {
    const { companyId, keyword, requiredExperience, routeType, equipmentType } =
      req.query;
    // const data = await findAndPopulate(companyId, 'active-jobs');
    const filters = {};

    filters.isActive = true;

    if (keyword) {
      filters.title = {
        $regex: new RegExp(keyword, 'i'),
      };
    }

    if (requiredExperience) {
      // filters.requiredExperience = requiredExperience;
      filters.requiredExperience = {
        $regex: new RegExp(requiredExperience, 'i'),
      };
    }
    if (routeType) {
      filters.routeType = { $regex: new RegExp(routeType, 'i') };
      // filters.routeType = routeType;
    }

    if (equipmentType) {
      filters.equipmentType = { $regex: new RegExp(equipmentType, 'i') };
      // filters.equipmentType = equipmentType;
    }

    const data = await Job.find(filters).populate('companyId');
    if (data) {
      return {
        status: true,
        data,
        message: message.JOBS_DETAILS,
      };
    } else {
      return {
        status: false,
        message: message.NO_JOB_FOUND,
      };
    }
  } catch (err) {
    console.log(
      'Error viewing all active jobs: ' + err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const findAndPopulate = async (id, findby) => {
  if (findby === 'companyId') {
    return await Job.find({
      companyId: id,
      isDeleted: false,
    }).populate('companyId');
  } else if (findby === 'active-jobs') {
    return await Job.find({
      isActive: true,
      isDeleted: false,
    }).populate('companyId');
  } else {
    return await Job.findOne({
      _id: mongoose.Types.ObjectId(id),
      isDeleted: false,
    }).populate('companyId');
  }
};

const findById = async (jobId) => {
  return await Job.findOne({
    _id: mongoose.Types.ObjectId(jobId),
  });
};

export {
  createOrUpdate,
  viewJob,
  findById,
  viewAllJobsByCompany,
  viewAllActiveJobs,
  findAndPopulate,
};
