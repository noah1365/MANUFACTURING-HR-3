import mongoose from "mongoose";

import { Incentive } from "../model/incentives/incentiveModel.js";
import { RequestIncentive } from "../model/incentives/requestIncentiveModel.js";

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
