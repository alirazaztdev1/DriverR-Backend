import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: false,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    isBlocked: {
      type: Boolean,
      required: false,
      default: false,
    },
    otp: {
      type: String,
      required: true,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: String,
      default: new Date(),
    },
  },
  { timestamps: true, get: (time) => time.toDateString(), versionKey: false }
);

authSchema.methods.verifyOTP = function (otp) {
  return this.otp === otp;
};

// userSchema.pre('save', function (next) {
//   if (this.isModified('otp') && this.verifyOTP(this.otp)) {
//     this.isVerified = true;
//   }
//   next();
// });

const Auth = mongoose.model('Auth', authSchema);

export default Auth;
