// packages
import chalk from 'chalk';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

// project modules
import Auth from '../models/auth.schema.js';
import { generateAuthToken } from '../utilities/authentication.js';
import { hashPassword, comparePassword } from '../utilities/bcrypt.js';
import { generateOTP } from '../utilities/common.utility.js';
import sendOTP from '../config/twilio.js';
import message from '../constants/message.constant.js';

// todos..
// 1. uncomment all sendOTP() functions

// Methods
const registerWithPhone = async (req) => {
  try {
    const user = await findByPhone(req.body.phoneNumber);
    if (!user) {
      const otp = generateOTP();
      const userData = {
        phoneNumber: req.body.phoneNumber,
        otp: otp,
      };
      await Auth.create(userData);
      // sendOTP(otp, req.body.phoneNumber);
      return {
        status: true,
        data: otp,
        message: message.OTP_SENT_SUCCESS,
      };
    }
    if (user && user?.isPhoneVerified && user.password) {
      return {
        status: false,
        message: message.ALREADY_SIGNEDUP,
      };
    } else if (user && user?.isPhoneVerified && !user.password) {
      // const otp = generateOTP();
      // const userData = {
      //   phoneNumber: req.body.phoneNumber,
      //   otp: otp,
      // };
      return {
        status: true,
        data: userData,
        message: message.ALREADY_REGISTERED_ADD_PASSWORD,
      };
    } else if (user && !user?.isPhoneVerified) {
      const otp = generateOTP();
      return {
        status: true,
        data: otp,
        message: message.OTP_SENT_SUCCESS,
      };
    }
    return {
      status: false,
      message: message.SOMETHIGN_WEND_WRONG,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const resendOTP = async (req) => {
  try {
    const user = await findByPhone(req.body.phoneNumber);
    if (user && !user.isPhoneVerified) {
      const otp = generateOTP();
      await Auth.updateOne(
        {
          phoneNumber: req.body.phoneNumber,
        },
        { otp: otp }
      );
      // sendOTP(otp, req.body.phoneNumber);
      return {
        status: true,
        data: otp,
        message: message.OTP_RESENT_SUCCESS,
      };
    }
    if (!user) {
      return {
        status: false,
        message: message.NOT_FOUND,
      };
    }
    return {
      status: false,
      message: message.PHONE_ALREADY_VERIFIED,
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const verifyOTP = async (req) => {
  const user = await findByPhone(req.body.phoneNumber);
  if (!user) {
    return {
      status: false,
      message: message.NOT_FOUND,
    };
  }
  if (user.isPhoneVerified && user.password) {
    return {
      status: false,
      message: message.PHONE_ALREADY_VERIFIED,
    };
  }
  if (user.verifyOTP(req.body.otp)) {
    user.isPhoneVerified = true;
    await user.save();
    return {
      status: true,
      message: message.PHONE_VERIFY_SUCCESS,
    };
  } else {
    return {
      status: false,
      message: message.INVALID_OTP,
    };
  }
};

const signup = async (req) => {
  let user = await findByPhone(req.body.phoneNumber);
  if (!user) {
    return {
      status: false,
      message: message.NOT_FOUND,
    };
  }
  if (!user.isPhoneVerified) {
    return {
      status: false,
      message: message.PHONE_NOT_VERIFIED,
    };
  }
  if (user.password) {
    return {
      status: false,
      data: user,
      message: message.SIGNUP_ALREADY,
    };
  }
  const hashedPassword = await hashPassword(req.body.password);
  await Auth.updateOne(
    {
      phoneNumber: req.body.phoneNumber,
    },
    {
      password: hashedPassword,
      isVerified: true,
    }
  );
  user = await findByPhone(req.body.phoneNumber);
  const accessToken = await generateAuthToken({
    id: user._id,
    phoneNumber: user.phoneNumber,
  });
  return {
    data: { user, accessToken },
    status: true,
    message: message.SIGNUP_SUCCESS,
  };
};

const signin = async (req) => {
  let user = await findByPhone(req.body.phoneNumber);
  if (!user) {
    return {
      status: false,
      message: message.NOT_FOUND,
    };
  }
  if (user.password) {
    const checkPassword = await comparePassword(
      req.body.password,
      user.password
    );
    if (!checkPassword) {
      return {
        status: false,
        message: message.INVALID_PASSWORD,
      };
    }
    user.lastLoginAt = new Date();
    user.isPhoneVerified = true;
    await user.save();

    const accessToken = await generateAuthToken({
      id: user._id,
      phoneNumber: user.phoneNumber,
    });
    return {
      data: { user, accessToken },
      status: true,
      message: message.SIGNIN_SUCCESS,
    };
  } else {
    return {
      status: false,
      message: message.SIGNUP_PENDING,
    };
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword, phoneNumber } =
    req.body;
  try {
    let user = await findByPhone(phoneNumber);
    if (!user) {
      return {
        status: false,
        message: message.NOT_FOUND,
      };
    }
    if (user.password) {
      const checkPassword = await comparePassword(
        currentPassword,
        user.password
      );
      if (!checkPassword) {
        return {
          status: false,
          message: message.INVALID_PASSWORD,
        };
      }
      if (newPassword !== confirmNewPassword) {
        return {
          status: false,
          message: message.CONFIRM_PASSWORD_NOT_MATCH,
        };
      }
      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;
      await user.save();
      return {
        status: true,
        message: message.PASSWORD_CHANGE_SUCCESS,
      };
    } else {
      return {
        status: false,
        message: message.SIGNUP_PENDING,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const forgetPassword = async (req) => {
  try {
    const user = await findByPhone(req.body.phoneNumber);
    if (!user) {
      return {
        status: false,
        message: message.NOT_FOUND,
      };
    }
    const otp = generateOTP();
    // sendOTP(otp, req.body.phoneNumber);
    user.otp = otp;
    user.isPhoneVerified = false;
    await user.save();
    return {
      status: true,
      data: otp,
      message: message.PASSWORD_RESET_OTP,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

const resetForgetPassword = async (req) => {
  const { phoneNumber, newPassword, confirmNewPassword } = req.body;
  const user = await findByPhone(phoneNumber);
  if (!user) {
    return {
      status: false,
      message: message.NOT_FOUND,
    };
  }
  if (newPassword !== confirmNewPassword) {
    return {
      status: false,
      message: message.CONFIRM_PASSWORD_NOT_MATCH,
    };
  }
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
  return {
    status: true,
    message: message.PASSWORD_RESET_SUCCESS,
  };
};

const getAll = async (req) => {
  try {
    const users = await Auth.find();
    return {
      data: { users: users },
      status: true,
      message: 'All Users',
    };
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const findById = async (id) => {
  return await Auth.findOne({
    _id: mongoose.Types.ObjectId(id),
  });
};

const findByPhone = async (phoneNumber) => {
  return await Auth.findOne({
    phoneNumber,
  });
};

export {
  registerWithPhone,
  resendOTP,
  verifyOTP,
  signup,
  signin,
  getAll,
  findById,
  changePassword,
  forgetPassword,
  resetForgetPassword,
};
