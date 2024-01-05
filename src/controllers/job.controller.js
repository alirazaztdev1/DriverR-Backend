import * as jobService from '../services/job.service.js';
import responseUtil from '../utilities/response.js';

const createOrUpdate = async (req, res) => {
  const response = await jobService.createOrUpdate(req);
  if (response?.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

const viewJob = async (req, res) => {
  const response = await jobService.viewJob(req);
  if (response?.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

const viewAllJobsByCompany = async (req, res) => {
  const response = await jobService.viewAllJobsByCompany(req);
  if (response?.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

const viewAllActiveJobs = async (req, res) => {
  const response = await jobService.viewAllActiveJobs(req);
  if (response?.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

export { createOrUpdate, viewJob, viewAllJobsByCompany, viewAllActiveJobs };
