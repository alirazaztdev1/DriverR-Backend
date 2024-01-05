import * as userService from '../services/auth.service.js';
import responseUtil from '../utilities/response.js';

const registerWithPhone = async (req, res) => {
  const response = await userService.registerWithPhone(req);
  console.log(response);
  if (response?.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response?.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const resendOTP = async (req, res) => {
  const response = await userService.resendOTP(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, {
      data: response.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const verifyOTP = async (req, res) => {
  const response = await userService.verifyOTP(req);
  if (response.status == false) {
    return responseUtil.noSuccessResponse(res, response?.message);
  } else if (response) {
    return responseUtil.successResponse(res, response?.message, null);
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const signup = async (req, res) => {
  const response = await userService.signup(req);
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

const signin = async (req, res) => {
  const response = await userService.signin(req);
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

const getAll = async (req, res) => {
  const response = await userService.getAll(req);
  if (response) {
    return responseUtil.successResponse(res, response.message, {
      data: response.data,
    });
  } else {
    return responseUtil.validationErrorResponse(res, response.message);
  }
};

const changePassword = async (req, res) => {
  const response = await userService.changePassword(req, res);
  if (response.status) {
    return responseUtil.successResponse(res, response.message);
  } else {
    return responseUtil.noSuccessResponse(res, response?.message);
  }
};

const forgetPassword = async (req, res) => {
  const response = await userService.forgetPassword(req);
  if (response.status) {
    return responseUtil.successResponse(res, response?.message, {
      data: response.data,
    });
  } else {
    return responseUtil.noSuccessResponse(res, response?.message);
  }
};

const resetForgetPassword = async (req, res) => {
  const response = await userService.resetForgetPassword(req);
  if (response.status) {
    return responseUtil.successResponse(res, response?.message, null);
  } else {
    return responseUtil.noSuccessResponse(res, response?.message);
  }
};

export {
  registerWithPhone,
  resendOTP,
  verifyOTP,
  signup,
  signin,
  getAll,
  changePassword,
  forgetPassword,
  resetForgetPassword,
};
