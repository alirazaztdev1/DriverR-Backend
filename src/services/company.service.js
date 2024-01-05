import mongoose from 'mongoose';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import Company from '../models/company.schema.js';
import * as authService from './auth.service.js';
import * as paymentService from './payment.service.js';
import message from '../constants/message.constant.js';

import {
  generateAdminNotification,
  superAdminNotificationText,
} from '../constants/notification.constant.js';
import { Subscription } from '../models/subscription.schema.js';
import { Plan } from '../models/payment.schema.js';
import Driver from '../models/driver.schema.js';

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
          await Company.updateOne(
            { userId: mongoose.Types.ObjectId(userId) },
            { ...req.body, profileStatus: 'PENDING', causeOfRejection: null }
          );
        } else {
          await Company.updateOne(
            { userId: mongoose.Types.ObjectId(userId) },
            req.body
          );
        }
      } else {
        // todo.. update and include image upload functionality
        let customer = await Company.create(req.body);
        // create stripe customer
        customer.phone = user.phoneNumber;
        await paymentService.createStripeCustomer(customer);

        // msg adding notification
      }
      const data = await findByUserId(user.id);

      if (!profileExist) {
        generateAdminNotification(
          superAdminNotificationText.WHEN_SUPER_ADMIN_RECEIVE_COMPANY_PROFILE_APPLICATION_TITLE,
          superAdminNotificationText.WHEN_SUPER_ADMIN_RECEIVE_COMPANY_PROFILE_APPLICATION_MESSAGE(
            data.name
          )
        );
      }
      return {
        status: true,
        data,
        message: `Profile ${profileExist ? 'updated' : 'created'} successfully`,
      };
    }
  } catch (err) {
    console.log('Error: ' + err?.message ? err?.message : err);
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewProfile = async (req) => {
  try {
    const { userId } = req.query;
    const data = await Company.findOne({
      userId,
    }).populate('userId', 'isActive');
    if (data) {
      return {
        status: true,
        data,
        message: `Profile details`,
      };
    } else {
      return {
        status: false,
        message: `Profile not found or not verified`,
      };
    }
  } catch (err) {
    console.log('Error: ' + err?.message ? err?.message : err);
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const viewDriverProfile = async (req) => {
  try {
    const { companyId, driverId } = req.query;
    // console.log('req.query:', req.query);
    const company = await findById(companyId);
    // console.log('company:', company);
    if (!company) {
      return {
        status: false,
        message: `Company not found`,
      };
    }
    const driver = await Driver.findOne({
      _id: mongoose.Types.ObjectId(driverId),
      isActive: true,
    });
    // console.log('driver:', driver);
    // console.log('companyId:', companyId);
    const companySub = await Subscription.findOne({
      companyId: mongoose.Types.ObjectId(companyId),
      isActive: true,
    });
    // console.log('companySub:', companySub);
    if (!companySub) {
      return {
        status: false,
        message: `Cannot view profile. Buy a subscription plan to continue with viewing profiles`,
      };
    }

    let isProfileAlreadyViewed =
      company?.viewedProfileIds.find((e) => e === driverId) != undefined;

    if (isProfileAlreadyViewed) {
      return {
        status: true,
        message: `Driver profile`,
        data: driver,
      };
    }

    if (company.totalProfilesAllowed <= company?.viewedProfileIds.length) {
      return {
        status: false,
        message: `Cannot view profile. Maximum profile views limit reached`,
      };
    }

    if (!isProfileAlreadyViewed) {
      await Company.updateOne(
        { _id: mongoose.Types.ObjectId(companyId) },
        { $push: { viewedProfileIds: driverId } }
      );
    }

    if (!driver) {
      return {
        status: false,
        message: `Driver not found`,
      };
    }
    return {
      status: true,
      message: `Driver profile`,
      data: driver,
    };
  } catch (err) {
    console.log(
      'Error in viewing driver profile : ',
      err?.message ? err?.message : err
    );
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

const topHiringCompanies = async (req) => {
  try {
    const data = await Company.find().sort({ numJobs: -1 }).limit(10);
    return {
      status: true,
      data,
      message: message.TOP_HIRING,
    };
  } catch (err) {
    console.log('Error: ' + err?.message ? err?.message : err);
    return {
      status: false,
      message: err?.message ? err?.message : err,
    };
  }
};

async function getAllCompanies(req, res) {
  const { keyword, gender, drivingExperience, employmentStatus } = req.query;

  const filters = {
    $or: [
      { name: new RegExp(keyword, 'is') },
      { tagLine: new RegExp(keyword, 'is') },
      { address: new RegExp(keyword, 'is') },
      { aboutInfo: new RegExp(keyword, 'is') },
      // { gender },
      // { drivingExperience },
      // { employmentStatus },
    ],
  };

  const data = await Company.find(filters);
  return {
    status: true,
    data,
    message: `Drivers' details`,
  };
}

const findByUserId = async (userId) => {
  return await Company.findOne({
    userId,
  });
};

const findById = async (companyId) => {
  return await Company.findOne({
    _id: mongoose.Types.ObjectId(companyId),
    isActive: true,
  });
};

export {
  updateProfile,
  viewProfile,
  findById,
  topHiringCompanies,
  getAllCompanies,
  viewDriverProfile,
};
