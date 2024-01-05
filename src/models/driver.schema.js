import mongoose from 'mongoose';

import { profileStatusEnum } from '../enums/statusType.enum.js';

const driverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    gender: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
      default: '',
    },
    equipmentType: {
      type: String,
      required: false,
    },
    licenceType: {
      type: String,
      required: false,
    },
    employmentStatus: {
      type: String,
      required: false,
      default: '',
    },
    drivingExperience: {
      type: String,
      required: false,
      default: '',
    },
    currentLocation: {
      type: String,
      required: false,
    },
    preferredLocations: {
      type: [String],
      required: false,
    },
    drivingLicense: {
      type: String,
      required: false,
    },
    drivingCertificate: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    numApplications: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    profileStatus: {
      type: String,
      enum: Object.values(profileStatusEnum),
      default: profileStatusEnum.PENDING,
    },

    causeOfRejection: {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
    },
    drivingLicense: { type: String },
    drivingCertificate: { type: String },
    profilePicture: { type: String },
    removeApplication: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
