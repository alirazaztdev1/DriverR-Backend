import * as faqsService from '../services/faqs.service.js';
import responseUtil from '../utilities/response.js';

const addFaq = async (req, res) => {
  const response = await faqsService.addFaq(req);
  if (response?.status === false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

const updateFaq = async (req, res) => {
  const response = await faqsService.updateFAQ(req);
  if (response?.status === false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

const viewAllFaqs = async (req, res) => {
  const response = await faqsService.viewAllFaqs(req);
  if (response?.status === false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

const removeFaq = async (req, res) => {
  const response = await faqsService.removeFaq(req);
  if (response?.status === false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response?.message);
  }
};

export { addFaq, updateFaq, viewAllFaqs, removeFaq };
