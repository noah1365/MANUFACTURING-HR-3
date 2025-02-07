import mongoose from "mongoose";

const appliedBenefitsSchema = new mongoose.Schema({
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
    benefitDetails: {
        selectedBenefit: {
            type: String,
            required: true,
        },
        sssNumber: {
            type: String,
            required: function () { return this.selectedBenefit === 'sss'; },
        },
        pagIbigId: {
            type: String,
            required: function () { return this.selectedBenefit === 'pagibig'; },
        },
        philHealthId: {
            type: String,
            required: function () { return this.selectedBenefit === 'philhealth'; },
        },
    },
    uploadedDocuments: {
        frontIdFile: {
            type: String,
            required: true,
        },
        backIdFile: {
            type: String,
            required: true,
        },
    },
    enrollmentDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
}, { timestamps: true });

export const AppliedBenefits = mongoose.model("AppliedBenefits", appliedBenefitsSchema);
