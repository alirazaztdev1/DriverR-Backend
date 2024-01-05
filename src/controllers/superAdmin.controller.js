import * as superAdminService from '../services/super-admin.service.js';
import responseUtil from '../utilities/response.js';

const login = async (req, res) => {
  const response = await superAdminService.login(req);
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

const viewJobById = async (req, res) => {
  const response = await superAdminService.viewJobById(req);
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

const activeInactiveCompany = async (req, res) => {
  const response = await superAdminService.activeInactiveCompany(req);
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

const activeInactiveDriver = async (req, res) => {
  const response = await superAdminService.activeInactiveDriver(req);
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

const removeDriverById = async (req, res) => {
  const response = await superAdminService.removeDriverById(req);
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

const viewRegisteredCompanies = async (req, res) => {
  const response = await superAdminService.viewRegisteredCompanies(req);
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

const viewAllDrivers = async (req, res) => {
  const response = await superAdminService.viewAllDrivers(req);
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

const removeJobById = async (req, res) => {
  const response = await superAdminService.removeJobById(req);
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

const viewAllJobs = async (req, res) => {
  const response = await superAdminService.viewAllJobs(req);

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

const removeCompanyById = async (req, res) => {
  const response = await superAdminService.removeCompanyById(req);

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

const activateJob = async (req, res) => {
  const response = await superAdminService.activateJob(req);

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

const adminChangePassword = async (req, res) => {
  const response = await superAdminService.adminChangePassword(req);

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

const manageDriverProfile = async (req, res) => {
  const response = await superAdminService.manageDriverProfile(req);
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
const manageCompanyProfile = async (req, res) => {
  const response = await superAdminService.manageCompanyProfile(req);
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

const forgetPassword = async (req, res) => {
  const response = await superAdminService.forgetPassword(req);
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

const resetPassword = async (req, res) => {
  const response = await superAdminService.resetPassword(req);
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

const verifyEmailCode = async (req, res) => {
  const response = await superAdminService.verifyEmailCode(req);
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

const resetEmailVerify = async (req, res) => {
  const response = await superAdminService.resetEmailVerify(req);
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

const updateEmail = async (req, res) => {
  const response = await superAdminService.updateEmail(req);

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

const dashboardKPIs = async (req, res) => {
  const response = await superAdminService.dashboardKPIs(req);
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

const removeCompanyApplications = async (req, res) => {
  const response = await superAdminService.removeCompanyApplications(req);
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
const removeDriversApplications = async (req, res) => {
  const response = await superAdminService.removeDriversApplications(req);
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

const getLogo = async (req, res) => {
  const response = await superAdminService.getLogo(req);
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

const addLogo = async (req, res) => {
  const response = await superAdminService.addLogo(req);
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

export {
  addLogo,
  getLogo,
  removeDriversApplications,
  removeCompanyApplications,
  dashboardKPIs,
  updateEmail,
  resetEmailVerify,
  viewJobById,
  activeInactiveCompany,
  activeInactiveDriver,
  removeDriverById,
  viewRegisteredCompanies,
  viewAllDrivers,
  removeJobById,
  viewAllJobs,
  removeCompanyById,
  activateJob,
  adminChangePassword,
  manageDriverProfile,
  manageCompanyProfile,
  forgetPassword,
  resetPassword,
  verifyEmailCode,
  login,
};
