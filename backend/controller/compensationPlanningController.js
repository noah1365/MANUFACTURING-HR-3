import { CompensationPlanning } from "../model/compensation/compensationPlanningModel.js";

export const createCompensationPlan = async (req, res) => {
    const {
        position,
        hourlyRate,
        overTimeRate,
        holidayRate,
        benefits,
        performanceMetrics,
        salaryAdjustmentGuidelines,
        effectiveDate,
        comments
    } = req.body;

    try {
        const isPositionExist = await CompensationPlanning.findOne({position});
        if(isPositionExist){
            return res.status(400).json({success:false,message:"Position already exists!"});
        }

        if(!Array.isArray(performanceMetrics) || performanceMetrics.length === 0){
            return res.status(400).json({success:false,message:"Performance metrics must be a non-empty array."});
        }

        const newPlan = new CompensationPlanning({
            position,
            hourlyRate,
            overTimeRate,
            holidayRate,
            benefits,
            performanceMetrics,
            salaryAdjustmentGuidelines,
            effectiveDate,
            comments
        });

        await newPlan.save();

        res.status(201).json({success:true,message:"Compensation created successfully!",data:newPlan});
    } catch (error) {
        console.error(`Error in creating compensation plan: ${error.message}`);
        
        res.status(500).json({success:false,message:"Server error",error: error.message || "An unexpected error occurred."});
    }
};

export const getCompensationPlan = async (req,res) => {
    try {
        const compensationPlans = await CompensationPlanning.find();
        res.status(200).json({success:true,data:compensationPlans});
    } catch (error) {
        console.log(`error in getting compensation plans ${error}`);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
};

export const getCompensationPosition = async (req,res) => {
    try {
        // const compensationPosition = await CompensationPlanning.find({},'position');
        const compensationPosition = await CompensationPlanning.find().populate('position');
        res.status(200).json({success:true,data:compensationPosition});
    } catch (error) {
        console.log(`error in getting compensation  ${error}`);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
};

export const updateCompensationPlan = async (req,res) => {
    const {id} = req.params;
    const {position,hourlyRate,overTimeRate,holidayRate,benefits,performanceMetrics,salaryAdjustmentGuidelines,effectiveDate,comments} = req.body;

    try {
            const compensationPlan = await CompensationPlanning.findById(id);
        if(!compensationPlan){
            return res.status(404).json({success:false,message:"Compensation plan not found."});
        }
        if (position && position !== compensationPlan.position) {
            const isPositionExist = await CompensationPlanning.findOne({ position });
            if (isPositionExist) {
                return res.status(400).json({ success: false, message: "Position already exists!" });
            }
        }

        compensationPlan.position = position || compensationPlan.position;
        compensationPlan.hourlyRate = hourlyRate || compensationPlan.hourlyRate;
        compensationPlan.overTimeRate = overTimeRate || compensationPlan.overTimeRate;
        compensationPlan.holidayRate = holidayRate || compensationPlan.holidayRate;
        compensationPlan.benefits = benefits || compensationPlan.benefits;
        compensationPlan.performanceMetrics = performanceMetrics || compensationPlan.performanceMetrics;
        compensationPlan.salaryAdjustmentGuidelines = salaryAdjustmentGuidelines || compensationPlan.salaryAdjustmentGuidelines;
        compensationPlan.effectiveDate = effectiveDate || compensationPlan.effectiveDate;
        compensationPlan.comments = comments || compensationPlan.comments;
        
        await compensationPlan.save();

        res.status(200).json({success:true,message:"Compensation plan updated successfully!",compensationPlan});

    } catch (error) {
        console.log(`error in updating compensation plans ${error}`);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
};

export const deleteCompensationPlan = async (req,res) => {
    const {id} =req.params;

    try {
        const compensationPlan = await CompensationPlanning.findByIdAndDelete(id);
        if(!compensationPlan){
            return res.status(404).json({status:false,message:"Compensation planning not found!"});
        }
        res.status(200).json({success:true,message:"Compensation plan Delete successfully!"});
    } catch (error) {
        console.log(`error in deleting compensation plans ${error}`);
        res.status(500).json({success:false,message:"Server error",error:error.message});
}}