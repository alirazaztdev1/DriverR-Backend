import mongoose from 'mongoose';
import { userTypeEnum } from '../enums/userType.enum.js';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    // todo.. change this to targetedUserType
    targetedUser: {
      type: String,
      enum: Object.values(userTypeEnum),
    },
  },
  { timestamps: true, get: (time) => time.toDateString(), versionKey: false }
);

const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
