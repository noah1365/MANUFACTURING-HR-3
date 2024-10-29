import { Benefit } from "../model/benefit/benefitModel.js";
import { BenefitEnrollmentRequest } from "../model/benefit/benefitEnrollmentRequestModel.js";

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

/* benefit enrollment */
export const enrollBenefit = async (req,res) => {
    
    const {benefitNames} = req.body; 
    const userId = req.user._id;

    try {
        if(!Array.isArray(benefitNames) ||benefitNames.length === 0){
            return res.status(400).json({status:false,message:"At least one Benefit name is required."});
        }

        const benefits = await Benefit.find({benefitsName:{$in:benefitNames}});

        if(benefits.length === 0){
            return res.status(404).json({status:false,message:"No valid benefits found."});
        }

        const benefitIds = benefits.map(benefit => benefit._id);

        const existingRequest = await BenefitEnrollmentRequest.findOne({userId,benefitIds:{$in:benefitIds}});
        if(existingRequest){
            return res.status(400).json({status:false,message:"User has already requested these benefits."});
        }

        const newRequest = new BenefitEnrollmentRequest({
            userId,
            benefitIds,
            userDetails: {
                lastName: user.lastName,
                firstName: user.firstName,
                middleName: user.middleName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                gender: user.gender,
                bDate: user.bDate
            }
        });
        await newRequest.save();

        return res.status(201).json({status:true,message:"Benefits request submitted successfully!",request:newRequest});
    } catch (error){
        console.error("Error enrolling in benefits:",error);
        return res.status(500).json({status: false, message:"Server error"});
    }
};


export const getBenefitsEnrolled = async(req,res) => {
    const userId = req.user._id; 

    try {
        const enrollment = await BenefitEnrollmentRequest.findOne({userId})
            .populate('benefitIds','benefitsName benefitsDescription') 
            .exec();

        if(!enrollment){
            return res.status(404).json({status:false,message:"No enrolled benefits found for this user."});
        }

        const response = {
            status:true,
            message:"Enrolled benefits retrieved successfully.",
            enrollment: {
                _id:enrollment._id,
                userId:enrollment.userId,
                benefits:enrollment.benefitIds,
                status:enrollment.status,
                enrollmentDate:enrollment.enrollmentDate,
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving enrolled benefits:",error);
        return res.status(500).json({status:false,message:"Server error"});
    }
};
