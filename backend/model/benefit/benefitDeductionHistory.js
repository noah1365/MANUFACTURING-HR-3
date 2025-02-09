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

},{timestamps:true});

export const BenefitDeductionHistory = new mongoose.model("BenefitDeductionHistory",benefitDeductionHistorySchema);