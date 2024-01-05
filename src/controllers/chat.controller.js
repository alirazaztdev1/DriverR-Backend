import * as chatService from '../services/chat.service.js';
import responseUtil from '../utilities/response.js';

const getAllChatsByUser = async (req, res) => {
  const response = await chatService.getAllChatsByUser(req);
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

const getChatById = async (req, res) => {
  const response = await chatService.getChatById(req);
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

const getChatByUserIds = async (req, res) => {
  const response = await chatService.getChatByUserIds(req);
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

const blockUnblock = async (req, res) => {
  const response = await chatService.blockUnblock(req);
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
  const response = await chatService.markAsRead(req);
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

const allUnreadCount = async (req, res) => {
  const response = await chatService.allUnreadCount(req);
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
  getAllChatsByUser,
  getChatById,
  getChatByUserIds,
  blockUnblock,
  markAsRead,
  allUnreadCount,
};
