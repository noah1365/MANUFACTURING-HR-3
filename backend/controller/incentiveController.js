import mongoose from "mongoose";

import { Incentive } from "../model/incentives/incentiveModel.js";
import { RequestIncentive } from "../model/incentives/requestIncentiveModel.js";
import { SalesCommission } from "../model/incentives/SalesCommissionModel.js";
import { RecognitionProgram } from "../model/incentives/recognitionProgramModel.js";
import { User } from "../model/userModel.js";
import { EmployeeSalesCommission } from "../model/incentives/employeeSalesCommission.js";
import cloudinary from "../config/cloudinaryConfig.js";
import upload from "../config/multerConfig.js";
import {SalesHistory} from './../model/incentives/salesHistoryModel.js'
import { Notification } from "../model/notificationModel.js";
import { io } from "../index.js";

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

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        if (!incentiveType || !comments) {
            return res.status(400).json({ success: false, message: "Select type and provide comments" });
        }

        const isRequestIncentiveExist = await RequestIncentive.findOne({
            incentiveType,
            employeeId: req.user._id
        });

        if (isRequestIncentiveExist) {
            return res.status(400).json({ success: false, message: "Incentive request already exists" });
        }

        const newRequest = await RequestIncentive.create({
            employeeId: req.user._id,
            incentiveType,
            comments
        });

        const userId = req.user._id;
        const user = await User.findById(userId).select('lastName');
        const employeeLastName = user.lastName || "Employee";

        const managers = await User.find({ role: 'Admin' });
        const managerIds = managers.map(manager => manager._id);

        for (const managerId of managerIds) {
            const notification = new Notification({
                userId: managerId,
                message: `${employeeLastName} created an incentive request`
            });
            await notification.save();
        }

        managerIds.forEach(managerId => {
            io.to(managerId.toString()).emit('requestIncentiveCreated', {
                message: `${employeeLastName} created an incentive request`,
                requestSalary: newRequest
            });
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

        const employee = await User.findById(updatedRequest.employeeId).select('email lastName');
        const employeeLastName = employee.lastName || "Employee";

        const notificationMessage = `Your incentive request has been ${status}`;
        const notification = new Notification({
            userId: updatedRequest.employeeId,
            message: notificationMessage,
        });
        await notification.save();

        io.to(updatedRequest.employeeId.toString()).emit('requestIncentiveStatusUpdated', {
            message: notificationMessage,
            requestIncentive: updatedRequest
        });

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

        const allSalesCommissions = await SalesCommission.find({
        })
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


export const assignSalesCommission = async (req, res) => {
    try {
        const { salesCommissionId } = req.body;
        const employeeId = req.user._id;

        if (!employeeId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        if (!salesCommissionId) {
            return res.status(400).json({ message: "Sales commission ID is required." });
        }

        const existingEmployee = await User.findById(employeeId);
        if (!existingEmployee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const existingCommission = await SalesCommission.findById(salesCommissionId);
        if (!existingCommission) {
            return res.status(404).json({ message: "Sales commission not found." });
        }

        if (existingCommission.status === "Not Available") {
            return res.status(400).json({ message: "This sales commission is not available for assignment." });
        }

        const existingRecord = await EmployeeSalesCommission.findOne({ employeeId, salesCommissionId });

        if (existingRecord) {
            return res.status(400).json({ message: "You already have this sales commission assigned." });
        }

        const newAssignment = new EmployeeSalesCommission({
            employeeId,
            salesCommissionId,
            totalSales: 0,
            salesStatus: "In Progress"
        });

        await newAssignment.save();

        existingCommission.assignedTo.push({
            employeeId: employeeId,
            assignStatus: "Assigned"
        });

        await existingCommission.save();

        return res.status(201).json({ 
            message: "Sales commission assigned successfully.", 
            assignment: newAssignment 
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};



export const addMySalesCommission = async (req, res) => {
    try {
        const { salesCommissionId, salesAmount } = req.body;
        const employeeId = req.user._id;

        if (!employeeId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        console.log("Debug - Received Body:", req.body);
        console.log("Debug - Employee ID:", employeeId);
        console.log("Debug - Sales Commission ID:", salesCommissionId);

        const myCommission = await EmployeeSalesCommission.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            salesCommissionId: new mongoose.Types.ObjectId(salesCommissionId)
        });

        if (!myCommission) {
            return res.status(404).json({ message: "No assigned sales commission found for this employee." });
        }

        let salesProof = [];
        if (req.file) {
            console.log("Uploading file to Cloudinary...");
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "sales_proof" });
            salesProof.push({ url: result.secure_url, uploadedAt: new Date() });
            console.log("File Uploaded:", result.secure_url);
        }

        const newSalesHistory = new SalesHistory({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            salesCommissionId: new mongoose.Types.ObjectId(salesCommissionId),
            salesAmount: Number(salesAmount),
            salesProof: salesProof,
            confirmationStatus: "Pending"
        });

        await newSalesHistory.save();

        const userId = req.user._id;
        const user = await User.findById(userId).select('lastName');
        
        const managers = await User.find({ role: 'Admin' });
        const managerIds = managers.map(manager => manager._id);
        const employeeLastName = user.lastName || "Employee";
        
        for (const managerId of managerIds) {
            const notification = new Notification({
                userId: managerId,
                message: `${employeeLastName} submitted a new sales commission request`,
            });
            await notification.save();
        }
        
        io.to(managerIds).emit('newSalesCommission', {
            message: `${employeeLastName} submitted a new sales commission request`,
            salesHistory: newSalesHistory,  
        });

        return res.status(200).json({
            message: "Sales added successfully. Recorded in SalesHistory.",
            newSalesHistory
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export { upload };

export const getAllAssignedSalesCommissions = async (req, res) => {
    try {
        const assignedCommissions = await SalesCommission.find({
            "assignedTo.assignStatus": { $in: ["Assigned", "Not Assigned"] }
        }).populate("assignedTo.employeeId");

        return res.status(200).json({
            message: "All assigned and not assigned sales commissions retrieved successfully.",
            assignedCommissions,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};
export const getAllEmployeeSalesStatus = async (req, res) => {
    try {
        const employeeSalesStatus = await EmployeeSalesCommission.find()
        .select("employeeId salesStatus totalSales");

        return res.status(200).json({
            message: "All employee sales status retrieved successfully.",
            employeeSalesStatus,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllAddedSalesCommissions = async (req, res) => {
    try {
        const addedSales = await SalesHistory.find()
            .populate("employeeId", "firstName lastName")
            .populate("salesCommissionId", "salesCommissionName targetAmount commissionRate")
            .select("salesAmount salesProof confirmationStatus createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All added sales commissions retrieved successfully.",
            addedSales,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getMyAddedSalesCommissions = async (req, res) => {
    try {
        const employeeId = req.user._id;

        if (!employeeId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const myAddedSales = await SalesHistory.find({ employeeId })
            .populate("salesCommissionId", "salesCommissionName targetAmount commissionRate")
            .select("salesAmount salesProof confirmationStatus createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Your added sales commissions retrieved successfully.",
            myAddedSales,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const getMyAssignedSalesCommissions = async (req, res) => {
    try {
        const employeeId = req.user._id;

        const assignedCommissions = await SalesCommission.find({
            "assignedTo.employeeId": employeeId,
            "assignedTo.assignStatus": { $in: ["Assigned", "Not Assigned"] }
        }).populate("assignedTo.employeeId");

        return res.status(200).json({
            message: "Your assigned and not assigned sales commissions retrieved successfully.",
            assignedCommissions,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getMySalesCommissions = async (req, res) => {
    try {
        const employeeId = req.user._id;

        if (!employeeId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const myCommissions = await EmployeeSalesCommission.find({ employeeId })
            .populate("salesCommissionId", "salesCommissionName commissionRate targetAmount")
            .select("salesStatus totalSales")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Your sales commissions retrieved successfully.",
            myCommissions,
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const updateConfirmationStatus = async (req, res) => {
    try {
        const { salesHistoryId, confirmationStatus } = req.body;

        if (!["Pending", "Approved", "Rejected"].includes(confirmationStatus)) {
            return res.status(400).json({ message: "Invalid confirmationStatus. Use 'Pending', 'Approved', or 'Rejected'." });
        }

        const salesHistory = await SalesHistory.findById(salesHistoryId);
        if (!salesHistory) {
            return res.status(404).json({ message: "No sales history found for this ID." });
        }

        if (salesHistory.confirmationStatus === "Approved") {
            return res.status(400).json({ message: "Sales record is already approved." });
        }

        const employeeId = salesHistory.employeeId;

        if (confirmationStatus === "Approved") {
            salesHistory.confirmationStatus = "Approved";

            const employeeSalesCommission = await EmployeeSalesCommission.findOne({
                employeeId: salesHistory.employeeId,
                salesCommissionId: salesHistory.salesCommissionId
            });

            if (!employeeSalesCommission) {
                return res.status(404).json({ message: "No employee sales commission record found." });
            }

            const salesCommission = await SalesCommission.findById(salesHistory.salesCommissionId);

            if (!salesCommission) {
                return res.status(404).json({ message: "Sales commission not found." });
            }

            employeeSalesCommission.totalSales += salesHistory.salesAmount;

            if (employeeSalesCommission.totalSales >= salesCommission.targetAmount) {
                employeeSalesCommission.salesStatus = "Completed";
            }

            employeeSalesCommission.earnedCommission = employeeSalesCommission.totalSales * (salesCommission.commissionRate / 100);

            await employeeSalesCommission.save();
        }

        if (confirmationStatus === "Rejected") {
            salesHistory.confirmationStatus = "Rejected";
        }

        await salesHistory.save();

        const employee = await User.findById(employeeId).select('lastName');
        const employeeLastName = employee.lastName || "Employee";

        const notification = new Notification({
            userId: employeeId,
            message: `Your sales commission request has been ${confirmationStatus}.`,
        });

        await notification.save();

        io.to(employeeId.toString()).emit('salesCommissionStatusUpdated', {
            message: `Your sales commission request has been ${confirmationStatus}.`,
            salesHistoryId: salesHistory._id,
            status: salesHistory.confirmationStatus,
        });

        return res.status(200).json({
            message: `Sales confirmation status updated to '${confirmationStatus}'.`,
            updatedCommission: salesHistory
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};






export const createRecognitionPrograms = async (req, res) => {
    try {
        const { employeeId, awardName, description, rewardType, rewardValue } = req.body;

        if (!employeeId || !awardName || !rewardType) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const employeeExists = await User.findById(employeeId);
        if (!employeeExists) {
            return res.status(404).json({ message: "Employee not found." });
        }

        let finalRewardValue = null; 

        if (rewardType === "Bonus" || rewardType === "Cash") {
            if (!rewardValue || isNaN(rewardValue) || rewardValue <= 0) {
                return res.status(400).json({ message: "Reward value is required and must be a positive number for Bonus or Cash." });
            }
            finalRewardValue = rewardValue;
        } else {
            finalRewardValue = null;
        }

        const newRecognition = new RecognitionProgram({
            employeeId,
            awardName,
            description,
            rewardType,
            rewardValue: finalRewardValue,
        });

        await newRecognition.save();

        const employee = await User.findById(employeeId).select('lastName');
        const employeeLastName = employee.lastName || "Employee";

        const notification = new Notification({
            userId: employeeId,
            message: `Congratulations! You have been recognized with the award '${awardName}'.`,
        });

        await notification.save();

        io.to(employeeId.toString()).emit('recognitionProgramCreated', {
            message: `Congratulations! You have been recognized with the award '${awardName}'.`,
            recognitionProgramId: newRecognition._id,
            awardName: newRecognition.awardName,
        });

        return res.status(201).json({ message: "Recognition program created successfully.", data: newRecognition });
    } catch (error) {
        console.error("Error creating recognition program:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



  export const getAllRecognitionPrograms = async (req, res) => {
    try {
        const allRecognitionPrograms = await RecognitionProgram.find({})
        .populate('employeeId','firstName lastName')
        return res.status(200).json(allRecognitionPrograms);
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};