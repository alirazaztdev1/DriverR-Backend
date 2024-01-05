import mongoose from 'mongoose';
import {
  AdminNotification,
  CompanyNotification,
  DriverNotification,
  Notification,
} from '../models/notification.schema.js';

import { userTypeEnum } from '../enums/userType.enum.js';

const getAll = async () => {
  const notification = await Notification.find();
  console.log(notification);
  if (notification) {
    return { status: true, message: 'Notification' };
  } else {
    return { status: false, message: 'Notification not found' };
  }
};

const getAllForSpecificUser = async (req, res) => {
  try {
    console.log('receive');
    const { id, userType } = req.query;

    let notification = '';
    if (userType === userTypeEnum.DRIVER) {
      notification = await Notification.find({
        driverId: mongoose.Types.ObjectId(id),
      });
    }

    if (userType === userTypeEnum.COMPANY) {
      notification = await Notification.find({
        companyId: mongoose.Types.ObjectId(id),
      });
    }

    console.log(notification);
    if (notification) {
      return { status: true, message: 'Notification', data: notification };
    } else {
      return { status: false, message: 'Notification not found' };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const markAsUnreadLength = async (req, res) => {
  try {
    const { id, userType } = req.query;
    let unreadLength = '';
    if (userType === userTypeEnum.DRIVER) {
      unreadLength = await DriverNotification.countDocuments({
        driverId: id,
        markAsRead: false,
      });
    }
    if (userType === userTypeEnum.COMPANY) {
      unreadLength = await CompanyNotification.countDocuments({
        companyId: id,
        markAsRead: false,
      });
    }

    return { status: true, message: 'Success', data: unreadLength };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const markAsRead = async (req) => {
  const { id, notificationsIds, userType } = req.body;
  console.log(notificationsIds);

  if (notificationsIds.length <= 0) {
    return { status: false, message: 'No notification send for read' };
  }
  if (userType === userTypeEnum.DRIVER) {
    const updatedNotifications = await DriverNotification.updateMany(
      { _id: { $in: notificationsIds }, driverId: id },
      { $set: { markAsRead: true } }
    );
    return { status: true, message: 'Updated', data: updatedNotifications };
  } else if (userType === userTypeEnum.COMPANY) {
    const updatedNotifications = await CompanyNotification.updateMany(
      { _id: { $in: notificationsIds }, companyId: id },
      { $set: { markAsRead: true } }
    );
    return { status: true, message: 'Updated', data: updatedNotifications };
  } else if (userType === 'ADMIN') {
    const updatedNotifications = await AdminNotification.updateMany(
      { _id: { $in: notificationsIds } },
      { $set: { markAsRead: true } }
    );
    return { status: true, message: 'Updated', data: updatedNotifications };
  }

  return {
    status: true,
    message: 'Successfully mark as read',
    data: updatedNotifications,
  };
};

const getAllAdminNotifications = async () => {
  try {
    const notification = await Notification.find({ __t: 'AdminNotification' });
    return {
      status: true,
      message: 'Successfully get all admin notifications',
      data: notification,
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export {
  getAll,
  getAllForSpecificUser,
  markAsUnreadLength,
  markAsRead,
  getAllAdminNotifications,
};
