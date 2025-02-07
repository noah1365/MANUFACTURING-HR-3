import mongoose from "mongoose";

const benefitsApprovedSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    benefitIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Benefit",
        required: true,
    }],
    approvalDate: {
        type: Date,
        default: Date.now,
    },
});

export const AppliedBenefitsApproved = mongoose.model("AppliedBenefitsApprooved", benefitsApprovedSchema);
