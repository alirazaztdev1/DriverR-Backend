import * as jobApplicationService from '../services/jobApplication.service.js';
import responseUtil from '../utilities/response.js';

const createJobApplication = async (req, res) => {
  const response = await jobApplicationService.createJobApplication(req);
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

const updateJobApplication = async (req, res) => {
  const response = await jobApplicationService.updateJobApplication(req);
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

const addToShortlist = async (req, res) => {
  const response = await jobApplicationService.addToShortlist(req);
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

const viewJobApplication = async (req, res) => {
  const response = await jobApplicationService.viewJobApplication(req);
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

const viewApplicationsByJob = async (req, res) => {
  const response = await jobApplicationService.viewApplicationsByJob(req);
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

const viewApplicationsByCompany = async (req, res) => {
  const response = await jobApplicationService.viewApplicationsByCompany(req);
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

const viewApplicationsByDriver = async (req, res) => {
  const response = await jobApplicationService.viewApplicationsByDriver(req);
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

export {
  viewJobApplication,
  updateJobApplication,
  addToShortlist,
  createJobApplication,
  viewApplicationsByJob,
  viewApplicationsByCompany,
  viewApplicationsByDriver,
};
