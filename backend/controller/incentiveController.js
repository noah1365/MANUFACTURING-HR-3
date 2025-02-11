import mongoose from "mongoose";

import { Incentive } from "../model/incentives/incentiveModel.js";
import { RequestIncentive } from "../model/incentives/requestIncentiveModel.js";
import { SalesCommission } from "../model/incentives/SalesCommissionModel.js";
import { RecognitionProgram } from "../model/incentives/recognitionProgramModel.js";
import { User } from "../model/userModel.js";
import { EmployeeSalesCommission } from "../model/incentives/employeeSalesCommission.js";
import cloudinary from "../config/cloudinaryConfig.js";
import upload from "../config/multerConfig.js";

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

        if (existingCommission.assignStatus === "Assigned") {
            return res.status(400).json({ message: "This sales commission is already assigned." });
        }

        const existingRecord = await EmployeeSalesCommission.findOne({ employeeId, salesCommissionId });

        if (existingRecord) {
            return res.status(400).json({ message: "You already have this sales commission assigned." });
        }

        const newAssignment = new EmployeeSalesCommission({
            employeeId,
            salesCommissionId,
            totalSales: 0,
            targetAmount: existingCommission.targetAmount,
            commissionRate: existingCommission.commissionRate,
            earnedCommission: 0,
            status: "In Progress"
        });

        await newAssignment.save();

        existingCommission.assignStatus = "Assigned";
        await existingCommission.save();

        return res.status(201).json({ message: "Sales commission assigned successfully.", assignment: newAssignment });

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

        console.log("🟢 Debug - Employee ID:", employeeId);
        console.log("🟢 Debug - Sales Commission ID:", salesCommissionId);

        const myCommission = await EmployeeSalesCommission.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            salesCommissionId: new mongoose.Types.ObjectId(salesCommissionId)
        }).populate("salesCommissionId");

        if (!myCommission) {
            return res.status(404).json({ message: "No assigned sales commission found for this employee." });
        }

        if (!myCommission.salesCommissionId || !myCommission.salesCommissionId.targetAmount) {
            return res.status(500).json({ message: "Sales commission target amount not found." });
        }

        myCommission.pendingSales.push({ amount: Number(salesAmount), addedAt: new Date() });

        console.log(`🟢 Sales Amount Added to Pending: ${salesAmount}`);

        if (req.file) {
            console.log("🟢 Uploading file to Cloudinary...");
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "sales_proof"
            });

            myCommission.salesProof.push({
                url: result.secure_url,
                uploadedAt: new Date()
            });

            console.log("🟢 File Uploaded:", result.secure_url);
        }

        console.log("🟢 Before Save:", myCommission.salesProof);
        await myCommission.save();
        console.log("🟢 After Save:", myCommission.salesProof);

        return res.status(200).json({
            message: "Sales added successfully but awaiting approval.",
            updatedCommission: myCommission
        });

    } catch (error) {
        console.error("🔴 Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export { upload };


export const getAllAssignedSalesCommissions = async (req, res) => {
    try {
        const assignedCommissions = await EmployeeSalesCommission.find()
            .populate("employeeId", "firstname lastname email")
            .populate("salesCommissionId", "targetAmount commissionRate")
            .select("totalSales pendingSales approvedSalesHistory salesStatus status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All assigned sales commissions retrieved successfully.",
            assignedCommissions,
        });
    } catch (error) {
        console.error("🔴 Server Error:", error);
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
            .populate("salesCommissionId", "targetAmount commissionRate")
            .select("totalSales pendingSales approvedSalesHistory salesStatus status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Your sales commissions retrieved successfully.",
            myCommissions,
        });
    } catch (error) {
        console.error("🔴 Server Error:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const updateSalesStatus = async (req, res) => {
    try {
        const { employeeId, salesCommissionId, salesStatus } = req.body;

        console.log("🟢 Debug - Employee ID:", employeeId);
        console.log("🟢 Debug - Sales Commission ID:", salesCommissionId);
        console.log("🟢 Debug - Sales Status:", salesStatus); 

        const myCommission = await EmployeeSalesCommission.findOne({
            employeeId: new mongoose.Types.ObjectId(employeeId),
            salesCommissionId: new mongoose.Types.ObjectId(salesCommissionId)
        }).populate("salesCommissionId");

        if (!myCommission) {
            return res.status(404).json({ message: "No assigned sales commission found for this employee." });
        }

        if (!myCommission.salesCommissionId || !myCommission.salesCommissionId.targetAmount) {
            return res.status(500).json({ message: "Sales commission target amount not found." });
        }

        if (!["Pending", "Approved", "Denied"].includes(salesStatus)) {
            return res.status(400).json({ message: "Invalid salesStatus. Use 'Pending', 'Approved', or 'Denied'." });
        }

        if (salesStatus === "Approved") {
            if (!myCommission.pendingSales || myCommission.pendingSales.length === 0) {
                return res.status(400).json({ message: "No pending sales to approve." });
            }

            const approvedSales = myCommission.pendingSales.reduce((acc, sale) => acc + sale.amount, 0);
            myCommission.totalSales += approvedSales;

            console.log(`🟢 Approved Sales: ${approvedSales}`);
            console.log(`🟢 Updated Total Sales: ${myCommission.totalSales} / Target: ${myCommission.salesCommissionId.targetAmount}`);

            myCommission.approvedSalesHistory.push(
                ...myCommission.pendingSales.map(sale => ({
                    amount: sale.amount,
                    approvedAt: new Date()
                }))
            );

            myCommission.salesStatus = "Approved";
            myCommission.pendingSales = [];

        } else if (salesStatus === "Denied") {
            console.log("🔴 Sales commission request denied.");
            myCommission.salesStatus = "Denied";
        }

        await myCommission.save();

        return res.status(200).json({
            message: `Sales status updated successfully as '${salesStatus}'.`,
            updatedCommission: myCommission
        });

    } catch (error) {
        console.error("🔴 Server Error:", error);
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