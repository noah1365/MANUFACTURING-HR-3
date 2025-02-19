import { CompensationPlanning } from "../model/compensation/compensationPlanningModel.js";
import { StandardCompensation } from "../model/compensation/standardCompensationModel.js";

export const createCompensationPlan = async (req, res) => {
    const {
        position,
        hourlyRate,
        overTimeRate,
        holidayRate,
        allowances,
    } = req.body;

    try {
        const isPositionExist = await CompensationPlanning.findOne({ position });
        if (isPositionExist) {
            return res.status(400).json({ success: false, message: "Position already exists!" });
        }

        const newPlan = new CompensationPlanning({
            position,
            hourlyRate,
            overTimeRate,
            holidayRate,
            allowances,
        });

        await newPlan.save();

        res.status(201).json({ success: true, message: "Compensation created successfully!", data: newPlan });
    } catch (error) {
        console.error(`Error in creating compensation plan: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message || "An unexpected error occurred." });
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

export const updateCompensationPlan = async (req, res) => {
    const { id } = req.params;
    const { position, hourlyRate, overTimeRate, holidayRate, allowances } = req.body;

    try {
        const compensationPlan = await CompensationPlanning.findById(id);
        if (!compensationPlan) {
            return res.status(404).json({ success: false, message: "Compensation plan not found." });
        }

        if (position && position !== compensationPlan.position) {
            const isPositionExist = await CompensationPlanning.findOne({ position });
            if (isPositionExist) {
                return res.status(400).json({ success: false, message: "Position already exists!" });
            }
        }
        let formattedAllowances = compensationPlan.allowances;
        if (allowances) {
            if (!Array.isArray(allowances)) {
                return res.status(400).json({ success: false, message: "Allowances must be an array!" });
            }

            formattedAllowances = allowances.map((allowance) => {
                if (typeof allowance !== "object" || !allowance.type || !allowance.amount) {
                    return res.status(400).json({ success: false, message: "Each allowance must have a 'type' and 'amount'." });
                }
                return { type: allowance.type, amount: allowance.amount };
            });
        }

        compensationPlan.position = position || compensationPlan.position;
        compensationPlan.hourlyRate = hourlyRate || compensationPlan.hourlyRate;
        compensationPlan.overTimeRate = overTimeRate || compensationPlan.overTimeRate;
        compensationPlan.holidayRate = holidayRate || compensationPlan.holidayRate;
        compensationPlan.allowances = formattedAllowances;

        await compensationPlan.save();

        res.status(200).json({
            success: true,
            message: "Compensation plan updated successfully!",
            compensationPlan,
        });

    } catch (error) {
        console.log(`Error in updating compensation plans: ${error.message}`);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
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



export const createStandardCompensation = async (req, res) => {
    try {
        const { standardName, standardDescription, standardStatus } = req.body;

        if (!standardName || standardStatus === undefined) {
            return res.status(400).json({ message: "standardName and standardStatus are required." });
        }

        const newStandardCompensation = new StandardCompensation({
            standardName,
            standardDescription,
            standardStatus
        });

        await newStandardCompensation.save();
        res.status(201).json({ message: "Standard compensation created successfully!", data: newStandardCompensation });

    } catch (error) {
        res.status(500).json({ message: "Error creating standard compensation", error: error.message });
    }
};


export const getStandardCompensation = async (req,res) => {
    try {
        const standardCompensations = await StandardCompensation.find();
        res.status(200).json({success:true,data:standardCompensations});
    } catch (error) {
        console.log(`error in getting compensation plans ${error}`);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
};


export const updateStandardCompensation = async (req, res) => {
    try {
        const { id } = req.params;
        const { standardName, standardDescription, standardStatus } = req.body;

        const updatedCompensation = await StandardCompensation.findByIdAndUpdate(
            id,
            { standardName, standardDescription, standardStatus },
            { new: true, runValidators: true }
        );

        if (!updatedCompensation) {
            return res.status(404).json({ message: "Standard compensation not found." });
        }

        res.status(200).json({ message: "Standard compensation updated successfully!", data: updatedCompensation });

    } catch (error) {
        res.status(500).json({ message: "Error updating standard compensation", error: error.message });
    }
};

export const deleteStandardCompensation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCompensation = await StandardCompensation.findByIdAndDelete(id);

        if (!deletedCompensation) {
            return res.status(404).json({ success: false, message: "Standard compensation not found." });
        }

        res.status(200).json({ success: true, message: "Standard compensation deleted successfully!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting standard compensation", error: error.message });
    }
};


// HR4 INTEGRATION
import cloudinary from '../config/cloudinaryConfig.js';
import { Grievance } from "../model/compensation/grievanceModel.js";
import upload from '../config/multerConfig.js';

// Get all grievance requests
export const getGrievanceRequests = async (req, res) => {
  try {
    const grievances = await Grievance.find();
    res.status(200).json(grievances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve grievances' });
  }
};



// UPDATE THEIR REQUESTS
export const updateGrievanceRequest = async (req, res) => {
  try {
    const { adminResponse, remarks } = req.body;
    const grievanceId = req.params.id;
    const updateData = { adminResponse, remarks, status: 'Responded' };

    if (req.file) {
      try {
        const uploadedFile = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) return reject(error);
              return resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        updateData.compensationFile = uploadedFile.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ error: 'Cloudinary upload failed' });
      }
    }

    const updatedGrievance = await Grievance.findByIdAndUpdate(grievanceId, updateData, { new: true });
    if (!updatedGrievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    res.status(200).json({ message: 'Grievance updated successfully', grievance: updatedGrievance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grievance' });
  }
};

export { upload };
