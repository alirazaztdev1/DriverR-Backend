import mongoose from 'mongoose';
import { jobApplicationStatusEnum } from '../enums/jobApplicationStatus.enum.js';

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    applyDate: {
      type: String,
      default: new Date(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isShortlisted: {
      type: Boolean,
      default: false,
    },
    isInterviewScheduled: {
      type: Boolean,
      default: false,
    },
    isFeedbackAdded: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(jobApplicationStatusEnum),
      default: jobApplicationStatusEnum.OPEN,
    },
    isHired: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
