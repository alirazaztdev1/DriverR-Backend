// Import the mongoose library
import mongoose from 'mongoose';
import { subscriptionTypeEnum } from '../enums/subscriptionType.enum.js';

// Define the Plan schema
const PlanSchema = new mongoose.Schema(
  {
    stripeProductId: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    interval: {
      type: String,
      enum: ['month', 'year'],
    },
    currency: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      enum: Object.values(subscriptionTypeEnum),
      required: true,
      // default: subscriptionTypeEnum.PRODUCT,
    },
    numberPostsAllowed: {
      type: Number,
      default: 0,
    },
    numberProfilesAllowed: {
      type: Number,
      default: 0,
    },
    numberApplicantsAllowed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Create the Plan model
const Plan = mongoose.model('Plan', PlanSchema);

export { Plan };
