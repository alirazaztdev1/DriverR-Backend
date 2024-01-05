import * as privacyPolicyService from '../services/privacy-policy.service.js';
import responseUtil from '../utilities/response.js';

const view = async (req, res) => {
  const response = await privacyPolicyService.view(req);
  // console.log(1, response);
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

export { view };
