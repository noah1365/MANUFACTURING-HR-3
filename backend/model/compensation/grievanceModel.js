import mongoose from 'mongoose';

const GrievanceSchema = new mongoose.Schema({
  referenceNo: {
    type: String,
    required: true,
    unique: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  grievanceDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Responded', 'Resolved'],
    default: 'Pending',
  },
  adminResponse: {
    type: String,
    default: null,
  },
  remarks: {
    type: String,
    default: null,
  },
  compensationFile: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export const Grievance = mongoose.model('Grievance', GrievanceSchema);
