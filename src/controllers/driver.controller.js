import * as driverService from '../services/driver.service.js';
import responseUtil from '../utilities/response.js';

const viewProfile = async (req, res) => {
  const response = await driverService.viewProfile(req);
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

const getAllDrivers = async (req, res) => {
  const response = await driverService.getAllDrivers(req);
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
  const response = await driverService.updateProfile(req);
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

export { viewProfile, updateProfile, getAllDrivers };
