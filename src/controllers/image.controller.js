import responseUtil from '../utilities/response.js';
import * as imageService from '../services/image.service.js';

const upload = async (req, res) => {
  const response = await imageService.upload(req);
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

export { upload };
