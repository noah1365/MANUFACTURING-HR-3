import mongoose from "mongoose";

const requestBenefitSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    benefitsName: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Benefit",
    },
    uploadDocs: {
      frontId: { type: String, required: true },
      backId: { type: String, required: true },
    },
    status:{
      type:String,
      enum:["Approved","Denied","Pending"],
      default:"Pending"
    }
  },
  { timestamps: true }
);

export const RequestBenefit = mongoose.model(
  "RequestBenefit",
  requestBenefitSchema
);
