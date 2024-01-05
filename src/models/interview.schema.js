import mongoose from 'mongoose';
import { jobApplicationStatusEnum } from '../enums/jobApplicationStatus.enum.js';

const interviewSchema = new mongoose.Schema(
  {
    jobApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobApplication',
    },
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
    scheduledAt: {
      type: String,
      default: new Date(),
    },
    onlineInterviewLink: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    feedback: {
      type: String,
      required: false,
    },
    isHired: {
      type: Boolean,
      default: false,
    },
    // status: {
    //   type: String,
    //   enum: Object.values(jobApplicationStatusEnum),
    //   default: jobApplicationStatusEnum.OPEN,
    // },
  },
  { timestamps: true, versionKey: false }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
