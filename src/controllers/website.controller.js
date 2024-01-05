import * as websiteService from '../services/website.service.js';
import responseUtil from '../utilities/response.js';

const sendEmail = async (req, res) => {
  const response = await websiteService.sendEmail(req);
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

export { sendEmail };
