import mongoose from 'mongoose';

import { profileStatusEnum } from '../enums/statusType.enum.js';

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
    },
    name: {
      type: String,
      required: false,
    },
    tagLine: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
    },
    photo: {
      type: String,
      required: false,
    },
    coverPhoto: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    registrationNumber: {
      type: String,
      required: false,
      default: '',
    },
    companySize: {
      type: String,
      required: false,
    },
    establishDate: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    aboutInfo: {
      type: String,
      required: false,
    },
    // count total jobs posted
    numJobs: {
      type: Number,
      default: 0,
    },
    // count total profile views
    numProfiles: {
      type: Number,
      default: 0,
    },
    viewedProfileIds: [
      {
        type: String,
      },
    ],
    // count num of job applications
    numJobApplications: {
      type: Number,
      default: 0,
    },
    // subscriptionPlan: {
    //   type: String,
    //   required: false,
    // },
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
    profilePicture: {
      type: String,
    },
    removeApplication: { type: Boolean, default: false },
    // fields to handle subscriptions checks, and corresponding allowed number of jobs, job applications and driver profiles
    totalJobsAllowed: {
      type: Number,
      default: 0,
    },
    totalProfilesAllowed: {
      type: Number,
      default: 0,
    },
    totalJobApplicationsAllowed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Company = mongoose.model('Company', companySchema);

export default Company;
