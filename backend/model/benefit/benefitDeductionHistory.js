import mongoose from "mongoose";

const benefitDeductionHistorySchema = new mongoose.Schema({
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
        amount:{
            type:Number,
            required:true
        },
        createdAt: { type: Date, default: Date.now }

},{timestamps:true});

export const BenefitDeductionHistory = new mongoose.model("BenefitDeductionHistory",benefitDeductionHistorySchema);