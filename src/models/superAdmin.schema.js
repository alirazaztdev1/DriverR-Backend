import mongoose from 'mongoose';

const superAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super-admin'],
    default: 'super-admin',
  },
  passwordVerificationCode: {
    type: String,
  },
  changeEmailVerification: {
    type: Boolean,
    required: false,
    default: false,
  },

  logo: { type: String },
});

const SuperAdmin = new mongoose.model('super-admin', superAdminSchema);
export default SuperAdmin;
