import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import Driver from '../models/driver.schema.js';
import * as authService from './auth.service.js';
import message from '../constants/message.constant.js';
import {
  generateAdminNotification,
  superAdminNotificationText,
} from '../constants/notification.constant.js';

const updateProfile = async (req) => {
  try {
    const { userId, email } = req.body;
    const regex_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const user = await authService.findById(userId);
    if (!regex_email.test(email)) {
      return {
        status: false,
        message: message.INVALID_EMAIL,
      };
    }
    if (user && user.isVerified) {
      const profileExist = await findByUserId(user.id);
      if (profileExist) {
        if (profileExist.profileStatus === 'REJECT') {
          await Driver.updateOne(
            { userId: mongoose.Types.ObjectId(userId) },
            { ...req.body, profileStatus: 'PENDING' }
          );
        } else {
          await Driver.updateOne(
            { userId: mongoose.Types.ObjectId(userId) },
            req.body
          );
        }
      } else {
        // todo.. update and include image upload functionality
        await Driver.create(req.body);
      }
      const data = await findByUserId(user.id);
      if (!profileExist) {
        generateAdminNotification(
          superAdminNotificationText.WHEN_SUPER_ADMIN_RECEIVE_DRIVERS_PROFILE_APPLICATION_TITLE,
          superAdminNotificationText.WHEN_SUPER_ADMIN_RECEIVE_DRIVERS_PROFILE_APPLICATION_MESSAGE(
            ` ${data.firstName} ${data.lastName} `
          )
        );
      }
      return {
        status: true,
        data,
        message: `Profile ${profileExist ? 'updated' : 'created'} successfully`,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

const viewProfile = async (req) => {
  try {
    const { userId } = req.query;
    const data = await Driver.findOne({
      userId,
    });
    if (data) {
      return {
        status: true,
        data,
        message: `Profile details`,
      };
    } else {
      return {
        status: false,
        message: message.PROFILE_NOT_FOUND,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

// AND operation
async function getAllDrivers(req) {
  const { keyword, gender, drivingExperience, employmentStatus } = req.query;

  const filters = {};

  if (keyword) {
    filters.firstName = new RegExp(keyword, 'i');
  }

  // if (lastName) {
  //   filters.lastName = new RegExp(keyword, 'i');
  // }

  if (gender) {
    filters.gender = gender;
  }

  if (drivingExperience) {
    filters.drivingExperience = drivingExperience;
  }

  if (employmentStatus) {
    filters.employmentStatus = employmentStatus;
  }
  // let results = await OrderModel.find().populate([{path: 'user', select: 'firstname'}, {path: 'meal', select: 'name'}]);
  // const data = await Driver.find(filters)
  // const data = await Driver.find(filters).populate('userId');
  const data = await Driver.find(filters).populate({
    path: 'userId',
    select: 'phoneNumber email',
  });
  return {
    status: true,
    data,
    message: `Drivers' details`,
  };
}

const approve = async (req) => {
  try {
    const { userId, isApproved } = req.query;
    const user = await authService.findById(userId); // Auth
    if (user) {
      // const profileExist = await findByUserId(user.id);
      // if (profileExist) {
      await Auth.updateOne(
        { id: mongoose.Types.ObjectId(userId) },
        { isApproved }
      );
      // } else {
      //   // todo.. update and include image upload functionality
      //   await Driver.create(req.body);
      // }
      const data = await findByUserId(user.id);
      return {
        status: true,
        data,
        message: `Driver profile ${
          isApproved ? 'approved' : 'rejected'
        } successfully`,
      };
    }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

async function getAllDrivers1(req, res) {
  const { keyword, gender, drivingExperience, employmentStatus } = req.query;

  const filters = {
    $or: [
      { firstName: new RegExp(keyword, 'is') },
      { lastName: new RegExp(keyword, 'is') },
      { gender },
      { drivingExperience },
      { employmentStatus },
    ],
  };

  const data = await Driver.find(filters);
  return {
    status: true,
    data,
    message: `Drivers' details`,
  };
}

const findByUserId = async (userId) => {
  return await Driver.findOne({
    userId,
  });
};

const findById = async (driverId) => {
  return await Driver.findOne({
    _id: mongoose.Types.ObjectId(driverId),
  });
};

export { updateProfile, viewProfile, findById, getAllDrivers, approve };
