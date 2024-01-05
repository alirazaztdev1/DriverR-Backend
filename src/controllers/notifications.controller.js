import responseUtil from '../utilities/response.js';

import * as notificationService from '../services/notification.service.js';

const getAll = async (req, res) => {
  const response = await notificationService.getAll(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};
const getAllForSpecificUser = async (req, res) => {
  const response = await notificationService.getAllForSpecificUser(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const markAsUnreadLength = async (req, res) => {
  const response = await notificationService.markAsUnreadLength(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const markAsRead = async (req, res) => {
  const response = await notificationService.markAsRead(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const getAllAdminNotifications = async (req, res) => {
  const response = await notificationService.getAllAdminNotifications(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

export {
  getAll,
  getAllForSpecificUser,
  markAsUnreadLength,
  markAsRead,
  getAllAdminNotifications,
};
