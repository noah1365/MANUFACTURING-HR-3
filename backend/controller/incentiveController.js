import mongoose from "mongoose";

import { Incentive } from "../model/incentives/incentiveModel.js";
import { RequestIncentive } from "../model/incentives/requestIncentiveModel.js";
import { SalesCommission } from "../model/incentives/SalesCommissionModel.js";

/* incentives overview crud */
export const createIncentive = async (req,res) => {
    try {
        const {incentivesName,incentivesDescription,incentivesType} = req.body;
        if(!incentivesName ||!incentivesDescription ||!incentivesType){
            return res.status(400).json({status:false,message:"All fields required!"});
        }
        const incentivesExist = await Incentive.findOne({incentivesName});
        if(incentivesExist){
            return res.status(400).json({status:false,message:"Incentive already exist!"});
        }
        const incentive = new Incentive({
            incentivesName,
            incentivesDescription,
            incentivesType,
            
        });
        await incentive.save();
        res.status(201).json({status:true,message:"Incentive created successfully!"});
    } catch (error) {
        console.log(`Error in login ${error}`);
        return res.status(500).json({success:false,message:"Server error"});
    }
};

export const getIncentive= async (req,res) => {
    try {
        const incentives = await Incentive.find({});
        res.status(200).json({status:true,incentives})
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({success:false,message:"Server error"});
    }
};

export const updateIncentive = async (req, res) => {
    try {
        const { id } = req.params;
        const {incentivesName,incentivesDescription,incentivesType} = req.body;

        if(!incentivesName || !incentivesDescription || !incentivesType){
            return res.status(400).json({status:false,message:"All fields required!"});
        }
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid incentive ID format."});
        }
        
        const incentive = await Incentive.findById(id);
        if(!incentive){
            return res.status(404).json({status:false,message:"Incentive not found!"});
        }

        const isUpdated = incentive.incentivesName !== incentivesName || 
                          incentive.incentivesDescription !== incentivesDescription || 
                          incentive.incentivesType !== incentivesType;

        if(isUpdated){
            incentive.incentivesName = incentivesName;
            incentive.incentivesDescription = incentivesDescription;
            incentive.incentivesType = incentivesType;
            await incentive.save();
            return res.status(200).json({status:true,message:"Incentive updated successfully!",updatedIncentive:incentive});
        } else {
            return res.status(200).json({status:true,message:"No changes detected, incentive remains unchanged.",updatedIncentive:incentive});
        }
    } catch (error) {
        console.error("Error updating incentive:",error);
        return res.status(500).json({status:false,message:"Server error"});
    }
};


export const deleteIncentive = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid incentive ID format."});
        }
        const incentive = await Incentive.findByIdAndDelete(id);
        if(!incentive){
            return res.status(404).json({status:false,message:"Incentive not found!"});
        }

        res.status(200).json({status:true,message:"incentive deleted successfully!"});
        
    } catch (error) {
        console.error("Error deleting incentive:",error);
        res.status(500).json({success:false, message:"Server error"});
    }
};


export const requestIncentive = async (req, res) => {
    try {
        const { incentiveType, comments } = req.body;
        if(!req.user || !req.user._id){
            return res.status(401).json({message:'User not authenticated.'});
        }

        if (!incentiveType || !comments) {
            return res.status(400).json({ success: false, message: "Select type and provide comments" });
        }

        const isRequestIncentiveExist = await RequestIncentive.findOne({ incentiveType });

        if (isRequestIncentiveExist) {
            return res.status(400).json({ success: false, message: "Incentive request already exists" });
        }

        const newRequest = await RequestIncentive.create({ 
            employeeId: req.user._id,
            incentiveType,
             comments
             });

        return res.status(201).json({
            success: true,
            message: "Incentive request submitted successfully",
            data: newRequest,
        });

    } catch (error) {
        console.error("Error in requestIncentive:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getMyRequestIncentives = async (req,res) => {
    try {
        if(!req.user || !req.user._id){
        return res.status(401).json({message:'User not authenticated.'});
        }
        const myRequestIncentives = await RequestIncentive.find({employeeId:req.user._id});
        res.status(200).json({status:true,myRequestIncentives})
    } catch (error) {
        console.error("Error in getting requestIncentive:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getAllRequestIncentives= async (req,res) => {
    try {
        const allRequestIncentive = await RequestIncentive.find({})
        .populate('employeeId','firstName lastName');
        res.status(200).json({status:true,requestIncentive:allRequestIncentive})
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({success:false,message:"Server error"});
    }
};

export const updateRequestIncentiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "denied"].includes(status.toLowerCase())) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const updatedRequest = await RequestIncentive.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.status(200).json({ success: true, message: `Request ${status}`, data: updatedRequest });

    } catch (error) {
        console.error("Error updating incentive request:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const createSalesCommission = async (req, res) => {
    try {
        const { salesCommissionName, targetAmount, commissionRate } = req.body;
        
        if (!salesCommissionName || !targetAmount || !commissionRate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newCommission = new SalesCommission({
            salesCommissionName,
            targetAmount,
            commissionRate,
            status: "Not Available"
        });

        await newCommission.save();
        return res.status(201).json({ message: "Sales Commission created successfully.", commission: newCommission });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllSalesCommission = async (req, res) => {
    try {
        // const allSalesCommissions = await SalesCommission.find({ status: "Not Available" })
        const allSalesCommissions = await SalesCommission.find({})
        .populate("appliedBy", "firstname lastname");
        return res.status(200).json(allSalesCommissions);
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateSalesCommission = async (req, res) => {
    try {
        const { id } = req.params;
        const { salesCommissionName, targetAmount, commissionRate, status } = req.body;

        const updatedCommission = await SalesCommission.findByIdAndUpdate(
            id,
            { salesCommissionName, targetAmount, commissionRate, status },
            { new: true, runValidators: true }
        );

        if (!updatedCommission) {
            return res.status(404).json({ message: "Sales Commission not found." });
        }

        return res.status(200).json({ message: "Sales Commission updated successfully.", commission: updatedCommission });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};