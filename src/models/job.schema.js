import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    title: {
      type: String,
      required: false,
    },
    requiredExperience: {
      type: String,
      required: false,
    },
    routeType: {
      type: String,
      required: false,
    },
    equipmentType: {
      type: String,
      required: false,
    },
    licenseRequired: {
      type: Boolean,
      default: false,
    },
    medicalInsuranceRequired: {
      type: Boolean,
      default: false,
    },
    jobDescription: {
      type: String,
      required: false,
    },
    isUpdatable: {
      type: Boolean,
      default: true,
    },
    isDeletable: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    jobId: { type: String, required: true },
    numApplications: {
      type: Number,
      default: 0,
    },
    jobUrl: {
      type: String,
    },
    licenceType: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
