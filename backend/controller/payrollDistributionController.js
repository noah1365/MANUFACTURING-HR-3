import { RequestedSalary } from '../model/payroll/requestedSalaryModel.js';
import {io} from '../index.js';
import { User } from '../model/userModel.js';
import { Notification } from '../model/notificationModel.js';

export const requestSalary = async (req, res) => {
    try {
        const {requestedAmount,paymentMethod,gCashNumber} = req.body;

        if(!req.user || !req.user._id){
            return res.status(401).json({message:'User not authenticated.'});
        }

        const requestedSalaries = await RequestedSalary.find();
        if(requestedSalaries.length > 0 && !requestedSalaries[0].isAvailable){
            return res.status(403).json({message:'Salary requests are currently not available.'});
        }

        const existingRequest = await RequestedSalary.findOne({employeeId:req.user._id, status:'Pending'});
        if(existingRequest){
            return res.status(400).json({message:'You have already sent a salary request that is still pending.'});
        }

        const requestSalary = new RequestedSalary({
            employeeId: req.user._id,
            requestedAmount,
            paymentMethod,
            gCashNumber: paymentMethod === 'GCash' ? gCashNumber : null,
        });
        await requestSalary.save();

        const userId = req.user._id;
        const user = await User.findById(userId).select('lastName');
        
        const managers = await User.find({ role: 'Admin' });
        const managerIds = managers.map(manager => manager._id);
        const employeeLastName = user.lastName || "Employee";
        console.log(user);

        for(const managerId of managerIds){
            const notification = new Notification({
                userId: managerId,
                message: `A salary request has been created by ${employeeLastName}`,
            });

            await notification.save();
        }
        io.to(managerIds).emit('requestSalaryCreated', {
            message: `A salary request has been created by ${employeeLastName}`,
            requestSalary
        });

        return res.status(201).json({message:'Salary request created successfully.',requestSalary});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Server error.',error: error.message});
    }
};



export const getRequestedSalary = async (req,res) => {
    try {
        const requestedSalaries = await RequestedSalary.find()
        .populate('employeeId', 'firstName lastName')
        .exec();

        res.status(200).json({sucess:true,data:requestedSalaries});
    } catch (error) {
        console.log(`error in getting salary requests ${error}`);
        res.status(500).json({success:false,message:"Server error",error:error.message});
    }
};

export const getMyRequestedSalary = async (req, res) => {
    try {
        if(!req.user || !req.user._id){
            return res.status(401).json({message:'User not authenticated.'});
        }

        const myRequestedSalaries = await RequestedSalary.find({employeeId:req.user._id});
        console.log("My Requested Salaries:", myRequestedSalaries);
        
        res.status(200).json({success:true,data:myRequestedSalaries});
    } catch (error) {
        console.log(`Error in getting my salary requests ${error}`);
        res.status(500).json({success:false,message:"Server error",error: error.message});
    }
};


export const reviewRequest = async (req, res) => {
    const {requestId} = req.params;
    const {action} = req.body;

    try {
        const requestedSalary = await RequestedSalary.findById(requestId);
        if(!requestedSalary){
            return res.status(404).json({message:'Request not found'});
        }

        if(requestedSalary.status === 'Approved' || requestedSalary.status === 'Rejected'){
            return res.status(400).json({message:'Cannot change status, request already processed'});
        }

        if(action === 'approve'){
            requestedSalary.status = 'Approved';
            io.emit('salaryRequestStatus', {
                employeeId:requestedSalary.employeeId,
                message:'Your salary request has been approved!',
                requestId:requestedSalary._id,
            });

            const newNotification = new Notification({
                userId: requestedSalary.employeeId,
                message: 'Your salary request has been approved!',
            });

            await newNotification.save();

        }else if(action === 'deny'){
            requestedSalary.status = 'Rejected';
            io.emit('salaryRequestStatus', {
                employeeId:requestedSalary.employeeId,
                message:'Your salary request has been rejected.',
                requestId:requestedSalary._id,
            });

            const newNotification = new Notification({
                userId: requestedSalary.employeeId,
                message: 'Your salary request has been rejected!',
            });

            await newNotification.save();
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await requestedSalary.save();

        return res.status(200).json({message:'Request updated',requestedSalary});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Server error'});
    }
};

export const toggleRequestAvailability = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access forbidden: Only managers can perform this action.' });
        }

        const requestedSalaries = await RequestedSalary.find();
        const isAvailable = requestedSalaries.length > 0 && requestedSalaries[0].isAvailable;

        if (isAvailable) {
            await RequestedSalary.updateMany({}, { isAvailable: false });
            io.emit('salaryRequestStatus', { message: 'Salary requests have been marked as not available.' });
            return res.status(200).json({ message: 'Salary requests forbidden.' });
        } else {
            await RequestedSalary.updateMany({}, { isAvailable: true });
            io.emit('salaryRequestStatus', { message: 'Salary requests are now available.' });
            return res.status(200).json({ message: 'Salary requests reinstated.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};