// Import the mongoose library
import mongoose from 'mongoose';

// Define the Addon schema
const AddonSchema = new mongoose.Schema(
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
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

// Create the Addon model
const Addon = mongoose.model('Addon', AddonSchema);

export { Addon };
