// Import the mongoose library
import mongoose from 'mongoose';
import { subscriptionTypeEnum } from '../enums/subscriptionType.enum.js';

// Define the Subscription schema
const SubscriptionSchema = new mongoose.Schema(
  {
    stripeSubscrpitionId: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeProductId: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    stripeSubscriptionDetails: {
      type: Object,
    },
    subscriptionType: {
      type: String,
      enum: Object.values(subscriptionTypeEnum),
      default: subscriptionTypeEnum.PRODUCT,
    },
    planName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Create the Subscription model
const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export { Subscription };
