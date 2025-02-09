import mongoose from "mongoose";

const benefitDeductionSchema = new mongoose.Schema({
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

export const BenefitDeduction = new mongoose.model("BenefitDeduction",benefitDeductionSchema);