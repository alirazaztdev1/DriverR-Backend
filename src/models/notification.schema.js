import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  markAsRead: {
    type: Boolean,
    default: false,
  },
  receivingTime: {
    type: Date,
    default: Date.now,
  },
});

const CompanyNotificationsSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});
const DriverNotificationsSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});
const AdminNotificationsSchema = new mongoose.Schema({});

const Notification = mongoose.model('Notification', notificationSchema);

const DriverNotification = Notification.discriminator(
  'DriverNotification',
  DriverNotificationsSchema
);
const CompanyNotification = Notification.discriminator(
  'CompanyNotification',
  CompanyNotificationsSchema
);
const AdminNotification = Notification.discriminator(
  'AdminNotification',
  AdminNotificationsSchema
);

export {
  DriverNotification,
  CompanyNotification,
  AdminNotification,
  Notification,
};
