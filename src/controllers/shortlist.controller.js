import * as shortlistService from '../services/shortlist.service.js';
import responseUtil from '../utilities/response.js';

const addToShortlist = async (req, res) => {
  const response = await shortlistService.addToShortlist(req);
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

const removeFromShortlist = async (req, res) => {
  const response = await shortlistService.removeFromShortlist(req);
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

const viewShortlistedByJob = async (req, res) => {
  const response = await shortlistService.viewShortlistedByJob(req);
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

const viewShortlistedByCompany = async (req, res) => {
  const response = await shortlistService.viewShortlistedByCompany(req);
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

const viewShortlistedByDriver = async (req, res) => {
  const response = await shortlistService.viewShortlistedByDriver(req);
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
  addToShortlist,
  removeFromShortlist,
  viewShortlistedByJob,
  viewShortlistedByCompany,
  viewShortlistedByDriver,
};
