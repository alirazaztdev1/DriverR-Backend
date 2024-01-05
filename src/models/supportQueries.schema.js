import mongoose from 'mongoose';
import { userTypeEnum } from '../enums/userType.enum.js';
import { queryStatusType } from '../enums/statusType.enum.js';

const supportQueriesSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(userTypeEnum),
    },
    status: {
      type: String,
      enum: Object.values(queryStatusType),
      default: 'PENDING',
    },
    queries: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        text: { type: String, required: false },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, get: (time) => time.toDateString(), versionKey: false }
);

const SupportQueries = mongoose.model('SupportQueries', supportQueriesSchema);
export default SupportQueries;
