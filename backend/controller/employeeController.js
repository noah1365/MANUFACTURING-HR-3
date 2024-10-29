import { User } from "../model/userModel.js";
import { CompensationPlanning } from "../model/compensation/compensationPlanningModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import mongoose from "mongoose";

export const fetchMyData = async (req,res) => {
    try {
        const userData = req.user;
        const user = await User.findById(userData);
        if(!user){
            return res.status(404).json({status:false,message:"User not found!"});
        }
        // console.log(user)
        res.status(200).json({status:true,user});
    } catch (error) {
        console.log(`Error in fetching user Data ${error}`);
        return res.status(500).json({message:"Server error!"});
    }
};


export const registerUser = async (req, res) => {
    try {
        const {position,lastName,firstName,middleName,email,phoneNumber,address,gender} = req.body;
        let bDate = req.body.bDate;
        const {street,municipality,province,postalCode,country} = address || {};

        const format = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const formattedLastName = format(lastName);
        const formattedFirstName = format(firstName);
        const formattedMiddleName = format(middleName);
        const formattedStreet = format(street);
        const formattedMunicipality = format(municipality);
        const formattedProvince = format(province);
        const formattedPostalCode = format(postalCode);
        const formattedCountry = format(country);

        const nameRegex = /^[A-Za-z\s]+$/;
        const addressRegex = /^[A-Za-z0-9\s\-.,]+$/;

        if(!nameRegex.test(lastName)){
            return res.status(400).json({status:false,message:"Last name contains invalid characters!"});
        }
        if(!nameRegex.test(firstName)){
            return res.status(400).json({status:false,message:"First name contains invalid characters!"});
        }
        if(middleName && !nameRegex.test(middleName)){
            return res.status(400).json({status:false,message:"Middle name contains invalid characters!"});
        }

        if(street && !addressRegex.test(street)) {
            return res.status(400).json({status:false,message:"Street address contains invalid characters!"});
        }
        if(municipality && !addressRegex.test(municipality)){
            return res.status(400).json({status:false,message:"Municipality contains invalid characters!"});
        }
        if(province && !addressRegex.test(province)){
            return res.status(400).json({status:false,message:"Province contains invalid characters!"});
        }
        if(postalCode && !/^\d+$/.test(postalCode)){
            return res.status(400).json({status:false,message:"Postal code must be numeric!"});
        }
        if(country && !nameRegex.test(country)){
            return res.status(400).json({status:false,message:"Country name contains invalid characters!"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({status:false,message:"User already exists!"});
        }

        const password = `#${lastName.charAt(0).toUpperCase()}${lastName.charAt(1).toLowerCase()}HR3`;
        const hashedPassword = await bcryptjs.hash(password, 10);

        // const compensationPlans = await CompensationPlanning.find({}, 'position');
        const compensationPlans = await CompensationPlanning.find().populate('position');
        const employeePositions = compensationPlans.map(plan => plan.position);
        let role;
        // if(position === "Manager"){
        //     role = "Manager";
        // }else if(employeePositions.includes(position)){
        //     role = "Employee";
        // }else{
        //     role = req.body.role;
        // }
        if (position.includes("Manager")) {
            role = "Manager";
        } else if (employeePositions.includes(position)) {
            role = "Employee";
        } else {
            role = req.body.role;
        }
        

        if(role === "Employee" && position === "Manager"){
            return res.status(400).json({status:false,message:"Conflicting role and position!"});
        }
        const uniqueRole = role === "Manager" ? "manager" : "employee";
        const user = new User({
            position,
            lastName:formattedLastName,
            firstName:formattedFirstName,
            middleName:formattedMiddleName,
            email,
            password:hashedPassword,
            phoneNumber,
            address:{
                street:formattedStreet,
                municipality:formattedMunicipality,
                province:formattedProvince,
                postalCode:formattedPostalCode,
                country:formattedCountry
            },
            gender,
            bDate,
            role,
            uniqueRole
        });
        await user.save();

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{ expiresIn:'1h'});

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });


        const baseUrl = process.env.NODE_ENV === "production"
        ? "https://hr3.jjm-manufacturing.com"
        : "http://localhost:5173";


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome! Please Set Your Password',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2>Welcome to HR3, ${formattedFirstName} ${formattedLastName}!</h2>
            <p>Thank you for registering as ${position}. To verify your account and set your new password, please click the button below:</p>
            <a href="${baseUrl}/verify-account/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Set Your Password</a>
            <p style="margin-top: 20px;">ifthe button above doesn't work, you can also clck the link below:</p>
            <a href="${baseUrl}/verify-account/${token}" style="color: #4CAF50;">${baseUrl}/verify-account/${token}</a>
            <p>This link will expire in 1 hour. ifyou did not request this, please ignore this eail.</p>
            <p>Best regards,<br />HR3 Team</p>
        </div>
    `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            status: true,
            message: "User registered successfully! A reset password email has been sent.",
            user
        });
    } catch (error) {
        console.log(`Error in register ${error}`);
        return res.status(500).json({ message: "Server error!" });
    }
};


export const changePassword = async (req, res) => {
    try {
        const {currentPassword,newPassword} = req.body;
        const userId = req.user;

        console.log("Request body:",req.body);
        console.log("User ID:",userId);

        if(!userId){
            return res.status(401).json({status:false,message:"Unauthorized: User ID is missing."});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({status:false,message:"User not found."});
        }
        const currentTime = new Date();
        const lastChangeTime = new Date(user.lastPasswordChange);
        const timeDifference = (currentTime - lastChangeTime) / (1000 * 60);
    
        if(timeDifference < 5){
          return res.status(400).json({ error: `You can change your password only after ${Math.ceil(5 - timeDifference)} minute(s).` });
        }

        const isCurrentPassword = await bcryptjs.compare(currentPassword,user.password);
        console.log("Is current password valid:",isCurrentPassword);
        if(!isCurrentPassword){
            return res.status(400).json({status:false,message:"Current password is incorrect."});
        }

        const isOldPassword = await bcryptjs.compare(newPassword,user.password);
        if(isOldPassword){
            return res.status(400).json({status:false,message:"New password cannot be the same as the old password."});
        }

        const hashedPassword = await bcryptjs.hash(newPassword,10);
        user.password = hashedPassword;
        user.lastPasswordChange = currentTime;
        await user.save();

        return res.status(200).json({status:true,message:"Password changed successfully",user});
    } catch (error) {
        console.error(`Error changing password: ${error}`);
        return res.status(500).json({status:false,message:"Server error"});
    }
};


export const verifyAccount = async (req, res) => {
    try {
        const {token} = req.params;
        const {newPassword} = req.body;

        let decoded;
        try {
            decoded = jwt.verify(token,process.env.JWT_SECRET);
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                return res.status(400).json({status:false,message:"Token has expired."});
            }
            return res.status(400).json({status:false,message:"Invalid token."});
        }
        
        const userId = decoded.id;

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({status:false,message:"Invalid or expired token."});
        }

        if(user.passwordReset){
            return res.status(400).json({status:false,message:"Password has already been reset."});
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.passwordReset = true;
        user.password = hashedPassword;
        user.verified = true
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const baseUrl = process.env.NODE_ENV === "production"
        ? "https://hr3.jjm-manufacturing.com"
        : "http://localhost:5173";



        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Account Verified!',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">Hi ${user.firstName} ${user.lastName},</h2>
                <p>Your account verification was successful! You can now log in to the system using your credentials.</p>
                <a href="${baseUrl}/login" 
                   style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   Log In to Your Account
                </a>
                <p><strong>Note:</strong> This email is intended only for the recipient and cannot be forwarded to others.</p>
                <br>
                <p>Best regards,<br>The HR3 Team</p>
            </div>
        `           
    };

        await transporter.sendMail(mailOptions);


        return res.status(200).json({status:true,message: "Password successfully changed!"});
    } catch (error) {
        console.log(`Error in changePassword: ${error}`);
        if(error.name === 'TokenExpiredError'){
            return res.status(400).json({status:false,message:"Token has expired."});
        }
        return res.status(500).json({message:"Server error!"});
    }
};

export const resendVerification = async (req,res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({status:false,message:"User not found."});
        }

        if(user.verified){
            return res.status(400).json({status:false,message:"User is already verified."});
        }


        const currentTime = new Date();
        const cooldownTime = 15 * 60 * 1000;

        if(user.lastVerificationRequest){
            const lastRequestTime = new Date(user.lastVerificationRequest);
            if(currentTime - lastRequestTime < cooldownTime){
                const remainingTime = cooldownTime - (currentTime - lastRequestTime);
                const minutes = Math.floor(remainingTime / (60 * 1000));
                const seconds = Math.ceil((remainingTime % (60 * 1000)) / 1000);
                
                return res.status(400).json({
                    status: false,
                    message: `You need to wait ${minutes} minutes and ${seconds} seconds before requesting again.`
                });
            }
        }

        user.lastVerificationRequest = currentTime;
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


        const baseUrl = process.env.NODE_ENV === "production"
        ? "https://hr3.jjm-manufacturing.com"
        : "http://localhost:5173";


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Account Verification',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">Hi ${user.firstName} ${user.lastName},</h2>
                <p>Please verify your account by clicking the link below:</p>
                <a href="${baseUrl}/verify-account/${token}" 
                   style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   Verify Account
                </a>
                <p>This link will expire in 1 hour. ifyou did not request this, please ignore this eail.</p>
                <br>
                <p>Best regards,<br>The HR3 Team</p>
            </div>
        `
         };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            status: true,
            message: "Verification email has been sent successfully!"
        });
    } catch (error) {
        console.log(`Error in resendVerification: ${error}`);
        return res.status(500).json({status:false,message:"Server error!"});
    }
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({status:false,message:"User not found!"});
        }

        console.log("User exists. Checking OTP resend interval...");
        const now = new Date();
        if(user.lastOtpSentAt && now - user.lastOtpSentAt < 2 * 60 * 1000){
            console.log("Resend attempted within 2 minutes");
            return res.status(429).json({
                status: false,
                message: "You can only resend OTP after 2 minutes."
            });
        }

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() + 15 * 60 * 1000);

        user.passwordResetOTP = otp;
        user.passwordResetOTPExpiration = otpExpiration;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from:process.env.EMAIL_USER,
            to:email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2>Hello, ${user.firstName}!</h2>
                    <p>You requested to reset your password. Please use the OTP below to reset your password:</p>
                    <h3 style="color: #4CAF50; font-size: 24px;">${otp}</h3>
                    <p>This OTP will expire in 15 minutes. If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br />HR3 Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            status: true,
            message: "OTP has been sent to your email address."
        });
    } catch (error) {
        console.log(`Error in forgotPassword: ${error}`);
        return res.status(500).json({ message: "Server error!" });
    }
};

export const resetPasswordWithOTP = async (req, res) => {
    try {
        const {email,otp,newPassword} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({status:false,message:"User not found!"});
        }

        if(user.passwordResetOTP !== otp || new Date() > user.passwordResetOTPExpiration){
            return res.status(400).json({status:false,message:"Invalid or expired OTP."});
        }

        const hashedPassword = await bcryptjs.hash(newPassword,10);

        user.password = hashedPassword;
        user.passwordResetOTP = null;
        user.passwordResetOTPExpiration = null;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            },
        });

        const baseUrl = process.env.NODE_ENV === "production"
        ? "https://hr3.jjm-manufacturing.com"
        : "http://localhost:5173";



        const mailOptions = {
            from:process.env.EMAIL_USER,
            to:user.email,
            subject: 'Password Reset Successful!',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #4CAF50;">Hi ${user.firstName} ${user.lastName},</h2>
                    <p>Your password has been successfully Reset! You can now log in with your new password.</p>
                    <a href="${baseUrl}/login" 
                       style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                       Log In to Your Account
                    </a>
                    <p><strong>Note:</strong> This email is intended only for the recipient and cannot be forwarded to others.</p>
                    <br>
                    <p>Best regards,<br>The HR3 Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({status:true,message:"Password reset successfully!"});
    } catch (error) {
        console.log(`Error in resetPasswordWithOTP: ${error}`);
        return res.status(500).json({message:"Server error!"});
    }
};

export const changeRole = async (req,res) => {
    try {
        const {id} = req.params;
        const {newRole} = req.body;
        
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({status:false,message:"Invalid benefit ID format."});
        }
        if(!["Employee", "Manager"].includes(newRole)){
            return res.status(400).json({success:false,message:"Invalid role"});
        }

        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }

        if(user.uniqueRole === "employee"){
            return res.status(403).json({success:false,message:"You cannot change your role."});
        }

        if(user.uniqueRole === "manager"){
        user.role = newRole;
        await user.save();
        return res.status(200).json({success:true,message:"User role updated successfully",user});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}