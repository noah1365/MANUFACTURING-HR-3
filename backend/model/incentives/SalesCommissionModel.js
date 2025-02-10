import mongoose from "mongoose";

const SalesCommissionSchema = new mongoose.Schema({
    salesCommissionName: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    commissionRate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Not Available"],
        default: "Available"
    },
}, { timestamps: true });

export const SalesCommission = mongoose.model("SalesCommission", SalesCommissionSchema);
