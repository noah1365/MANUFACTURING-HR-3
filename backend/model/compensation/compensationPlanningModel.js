import mongoose from "mongoose";

const compensationPlanningSchema = new mongoose.Schema({
    position:{
        type:String,
        required:true
    },
    hourlyRate:{
        type:Number,
        required: true 
    },
    overTimeRate:{
        type:Number,
        required: true 
    },
    holidayRate:{
        type:Number,
        required: true 
    },
    benefits: [{
        name:{ 
            type:String,
            required:true
        },
        deduction: {
            type:Number,
            required:true
        },
    }],
    performanceMetrics: [{
        name:{ 
            type:String,
            required:true
        },
        metrics: {
            type:Number,
            required:true
        },
    }],
    salaryAdjustmentGuidelines:{
        type:String,
        default:[]
    },
    effectiveDate:{
        type:Date,
        required:true
    },
    approvalStatus:{
        type:String,
        enum:['Approved', 'Pending', 'Rejected'], 
        default: 'Pending'
    },
    comments:{ 
        type:String, 
        default: '' 
    }
},{timestamps:true});

export const CompensationPlanning = mongoose.model("CompensationPlanning",compensationPlanningSchema);