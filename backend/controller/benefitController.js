import { Benefit } from "../model/benefit/benefitModel.js";
import { User } from "../model/userModel.js";

import mongoose from "mongoose";

/* benefit overview crud */
export const createBenefit = async (req,res) => {
    try {
        const {benefitsName,benefitsDescription,benefitsType,requiresRequest} = req.body;
        if(!benefitsName ||!benefitsDescription ||!benefitsType){
            return res.status(400).json({status:false,message:"All fields required!"});
        }
        const benefitsExist = await Benefit.findOne({benefitsName});
        if(benefitsExist){
            return res.status(400).json({status:false,message:"Benefits already exist!"});
        }
        const benefit = new Benefit({
            benefitsName,
            benefitsDescription,
            benefitsType,
            requiresRequest
        });
        await benefit.save();
        res.status(201).json({status:true,message:"Benefit created successfully!"});
    } catch (error) {
        console.log(`Error in login ${error}`);
        return res.status(500).json({success:false,message:"Server error"});
    }
};

export const getBenefit = async (req,res) => {
    try {
        const benefits = await Benefit.find({});
        res.status(200).json({status:true,benefits})
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateBenefit = async (req, res) => {
    try {
        const { id } = req.params;
        const {benefitsName,benefitsDescription,benefitsType,requiresRequest} = req.body;

        if(!benefitsName || !benefitsDescription || !benefitsType){
            return res.status(400).json({status:false,message:"All fields required!"});
        }
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid benefit ID format."});
        }
        
        const benefit = await Benefit.findById(id);
        if(!benefit){
            return res.status(404).json({status:false,message:"Benefit not found!"});
        }

        const isUpdated = benefit.benefitsName !== benefitsName || 
                          benefit.benefitsDescription !== benefitsDescription || 
                          benefit.benefitsType !== benefitsType || 
                          benefit.requiresRequest !== requiresRequest;

        if(isUpdated){
            benefit.benefitsName = benefitsName;
            benefit.benefitsDescription = benefitsDescription;
            benefit.benefitsType = benefitsType;
            benefit.requiresRequest = requiresRequest;
            await benefit.save();
            return res.status(200).json({status:true,message:"Benefits updated successfully!",updatedBenefit:benefit});
        } else {
            return res.status(200).json({status:true,message:"No changes detected, benefit remains unchanged.",updatedBenefit:benefit});
        }
    } catch (error) {
        console.error("Error updating benefit:", error);
        return res.status(500).json({status:false,message:"Server error"});
    }
};


export const deleteBenefit = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid benefit ID format."});
        }
        const benefit = await Benefit.findByIdAndDelete(id);
        if(!benefit){
            return res.status(404).json({status:false,message:"Benefit not found!"});
        }

        res.status(200).json({status:true,message:"Benefit deleted successfully!"});
        
    } catch (error) {
        console.error("Error deleting benefit:",error);
        res.status(500).json({success:false,message:"Server error"});
    }
};


import cloudinary from "../config/cloudinaryConfig.js";
import upload from "../config/multerConfig.js"; 
import { RequestBenefit } from "../model/benefit/requestBenefitModel.js";
import { BenefitDeduction } from "../model/benefit/benefitDeductionsModel.js";
import { BenefitDeductionHistory } from "../model/benefit/benefitDeductionHistory.js";
import { Notification } from "../model/notificationModel.js";
import { io } from "../index.js";

export const requestBenefit = async (req, res) => {
    try {
        console.log("Authenticated User ID:", req.user._id);
        console.log("Request Body:", req.body);  
        console.log("Uploaded Files:", req.files);

        let { benefitsName } = req.body;

        if (!benefitsName) {
            return res.status(400).json({ message: "Benefit name is required." });
        }

        const benefit = await Benefit.findOne({ benefitsName: { $regex: new RegExp(`^${benefitsName}$`, "i") } });

        if (!benefit) {
            console.log("Benefit not found in database:", benefitsName); 
            return res.status(404).json({ message: "Benefit not found." });
        }

        console.log("Benefit found:", benefit);

        const existingRequest = await RequestBenefit.findOne({
            employeeId: req.user._id,
            benefitsName: benefit._id,
            status: { $in: ["Pending", "Approved"] }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: existingRequest.status === "Approved"
                    ? "You have already been approved for this benefit."
                    : "You already have a pending request for this benefit."
            });
        }

        if (!req.files || !req.files.frontId || !req.files.backId) {
            return res.status(400).json({ message: "Both front and back ID images are required." });
        }

        const newRequest = new RequestBenefit({
            employeeId: req.user._id,
            benefitsName: benefit._id,
            uploadDocs: {
                frontId: req.files.frontId[0].path,
                backId: req.files.backId[0].path,
            },
            status: "Pending"
        });

        await newRequest.save();

        // Create and emit notification
        const userId = req.user._id;
        const user = await User.findById(userId).select('lastName');
        
        const managers = await User.find({ role: 'Admin' });
        const managerIds = managers.map(manager => manager._id);
        const employeeLastName = user.lastName || "Employee";
        
        for (const managerId of managerIds) {
            const notification = new Notification({
                userId: managerId,
                message: `${employeeLastName} created a benefit request`,
            });
        
            await notification.save();
        }
        
        // Emit socket event
        io.to(managerIds).emit('requestSalaryCreated', {
            message: `${employeeLastName} created a benefit request`,
            requestSalary: newRequest,  // Ensure to emit the correct object
        });
        
        // Send response after all is complete
        res.status(201).json({
            message: "Benefit request created successfully",
            newRequest
        });
        
    } catch (error) {
        console.error("Error in requestBenefit:", error);
        res.status(500).json({ message: error.message });
    }
};


export { upload };

export const getMyRequestBenefits = async (req,res) => {
    try {
        if(!req.user || !req.user._id){
        return res.status(401).json({message:'User not authenticated.'});
        }
        const myRequestBenefits = await RequestBenefit.find({employeeId:req.user._id})
        .populate("benefitsName", "benefitsName");
        res.status(200).json({status:true,myRequestBenefits})
    } catch (error) {
        console.error("Error in getting requesting benefit:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllRequestBenefits = async (req, res) => {
    try {
        const allRequestBenefits = await RequestBenefit.find({})
            .populate('employeeId', 'firstName lastName')
            .populate('benefitsName','benefitsName')
            .select("benefitsName status createdAt uploadDocs");
    
        res.status(200).json({ status: true, requestBenefit: allRequestBenefits });
    } catch (error) {
        console.error("Error fetching request benefits:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateRequestBenefitStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log("Received ID:", id);
        console.log("Received Status:", status);

        if (!["Approved", "Denied"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const updatedRequest = await RequestBenefit.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const employee = await User.findById(updatedRequest.employeeId).select('lastName');
        const employeeLastName = employee.lastName || "Employee";

        const notification = new Notification({
            userId: updatedRequest.employeeId,
            message: `Your benefit request has been ${status}`,
        });

        await notification.save();

        io.to(updatedRequest.employeeId.toString()).emit('requestBenefitStatusUpdated', {
            message: `Your benefit request has been ${status}`,
            requestId: updatedRequest._id,
            status: updatedRequest.status,
        });

        res.status(200).json({ success: true, message: `Request ${status}`, data: updatedRequest });

    } catch (error) {
        console.error("Error updating benefit request status:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const addBenefitDeduction = async (req, res) => {
    try {
        const { employeeId, benefitsName, amount } = req.body;
        console.log("Received data:", req.body); 
        if (!mongoose.isValidObjectId(employeeId) || !mongoose.isValidObjectId(benefitsName)) {
            return res.status(400).json({ success: false, message: "Invalid Employee or Benefit ID" });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Deduction amount must be greater than 0" });
        }

        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        const benefit = await Benefit.findById(benefitsName);
        if (!benefit) {
            return res.status(404).json({ success: false, message: "Benefit not found" });
        }

        const isApproved = await RequestBenefit.findOne({ employeeId, benefitsName, status: "Approved" });
        if (!isApproved) {
            return res.status(403).json({ success: false, message: "Employee is not approved for this benefit" });
        }

        let deduction = await BenefitDeduction.findOne({ employeeId, benefitsName });

        if (deduction) {
            deduction.amount += amount;
            await deduction.save();
        } else {
            deduction = new BenefitDeduction({ employeeId, benefitsName, amount });
            await deduction.save();
        }

        const deductionHistory = new BenefitDeductionHistory({ employeeId, benefitsName, amount });
        await deductionHistory.save();
        console.log(deductionHistory);
        res.status(201).json({
            success: true,
            message: "Benefit Deduction recorded successfully",
            deduction,
            history: deductionHistory,
        });

    } catch (error) {
        console.error("Error processing benefit deduction:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getAllBenefitDeductions = async (req, res) => {
    try {
        const deductions = await BenefitDeduction.find({})
            .populate("employeeId", "firstName lastName")
            .populate("benefitsName", "benefitsName");

        res.status(200).json({ success: true, deductions });
    } catch (error) {
        console.error("Error fetching benefit deductions:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const getBenefitDeductionHistory = async (req, res) => {
    try {
        const history = await BenefitDeductionHistory.find({})
            .populate("employeeId", "firstName lastName")
            .populate("benefitsName", "benefitsName createdAt");

        res.status(200).json({ success: true, history });
    } catch (error) {
        console.error("Error fetching benefit deductions:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const getMyBenefitDeductions = async (req, res) => {
    try {
        console.log("Request User:", req.user);
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        const userId = req.user.id;
        const myHistory = await BenefitDeductionHistory.find({ userId })
            .populate("benefitsName", "benefitsName amount")
            .select("amount createdAt"); // Ensure createdAt is included

        res.status(200).json({ success: true, myHistory });
    } catch (error) {
        console.error("Error fetching my benefit deductions:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
