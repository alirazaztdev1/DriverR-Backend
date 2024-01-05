import * as supportQueriesService from '../services/supportQueries.service.js';
import responseUtil from '../utilities/response.js';
const send = async (req, res) => {
  const response = await supportQueriesService.send(req);
  if (response.status == false) {
    console.log({ response });
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};
const viewAllSupportQueries = async (req, res) => {
  const response = await supportQueriesService.viewAllSupportQueries(req);
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

const allUserQueries = async (req, res) => {
  const response = await supportQueriesService.allUserQueries(req);
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

const createTicket = async (req, res) => {
  const response = await supportQueriesService.createTicket(req);
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
const updateStatus = async (req, res) => {
  const response = await supportQueriesService.updateStatus(req);
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

const queryConversation = async (req, res) => {
  const response = await supportQueriesService.queryConversation(req);
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
  send,
  viewAllSupportQueries,
  createTicket,
  allUserQueries,
  updateStatus,
  queryConversation,
};
