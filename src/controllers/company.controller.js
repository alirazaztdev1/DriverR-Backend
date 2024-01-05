import * as companyService from '../services/company.service.js';
import responseUtil from '../utilities/response.js';

const viewProfile = async (req, res) => {
  const response = await companyService.viewProfile(req);
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

const updateProfile = async (req, res) => {
  const response = await companyService.updateProfile(req);
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

const viewDriverProfile = async (req, res) => {
  const response = await companyService.viewDriverProfile(req);
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

const topHiringCompanies = async (req, res) => {
  const response = await companyService.topHiringCompanies(req);
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

const getAllCompanies = async (req, res) => {
  const response = await companyService.getAllCompanies(req);
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
  viewProfile,
  updateProfile,
  topHiringCompanies,
  getAllCompanies,
  viewDriverProfile,
};
