import mongoose from "mongoose";

const EmployeeSalesCommissionSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    salesCommissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesCommission",
        required: true
    },
    totalSales: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress"
    },
    salesProof: [
        {
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now } 
        }
    ],
    salesStatus: {
        type: String,
        enum: ["Pending", "Approved", "Denied"],
        default: "Pending"
    }
}, { timestamps: true });

export const EmployeeSalesCommission = mongoose.model("EmployeeSalesCommission", EmployeeSalesCommissionSchema);
