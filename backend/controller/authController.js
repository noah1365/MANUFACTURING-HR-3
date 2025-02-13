import bcryptjs from 'bcryptjs';
import { User } from "../model/userModel.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const token = req.cookies.token;
    const {email,password} = req.body;

    try {
        if(token){
            return res.status(400).json({message:"You are already logged in"});
        }

        console.log(`Attempting to log in with email: ${email}`);
        const user = await User.findOne({ email });
        
        if(!user){
            console.log("User not found");
            return res.status(400).json({success:false,message:"Username or password is incorrect"});
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if(!isPasswordValid){
            console.log("Invalid password");
            return res.status(400).json({success:false,message:"Username or password is incorrect"});
        }

/*         if(!user.verified){
            console.log("User account not verified");
            return res.status(403).json({success:false,message:"Your account is not verified. Please verify your account before logging in."});
        } */

        generateTokenAndSetCookie(res, user._id, user.role);
        console.log(`User ${user.email} logged in successfully`);
        return res.status(200).json({success:true,message:"Logged in successfully",role:user.role});
    } catch (error) {
        console.error(`Error in login: ${error}`);
        return res.status(500).json({success:false,message:"Server error"});
    }
};

export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token; 
        if(!token){
            return res.status(401).json({success:false,message:"No token found"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId); 

        if(!user){
            return res.status(401).json({success:false,message:"User not found"});
        }

        res.json({success:true,user});
    } catch (error) {
        console.error("Error in checkAuth:", error);

        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({success:false,message:"Invalid token"});
        } else if(error.name === 'TokenExpiredError'){
            return res.status(401).json({success:false,message:"Token expired"});
        } else{
            return res.status(500).json({success:false,message:"Server error"});
        }
    }
};

export const logout = async (req, res) => {
    try {
        if(!req.cookies.token){
            return res.status(400).json({ success: false, message: "You are not logged in" });
        }
        const userId = req.user;
        const user = await User.findById(userId);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.clearCookie("_csrf", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        

        return res.status(200).json({ success: true, message: "Logged out successfully",user });
    } catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ success: false, message: "Server error during logout" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'firstName lastName email position role verified');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const deleteUser = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({success:false,message:"User not Found"});
        }
        res.status(200).json({success:true,message:"User delete successfully!"});
    } catch (error) {
        console.error("Error deleting users:", error);
        res.status(500).json({success:false,message:"Server error"});
    }
}
