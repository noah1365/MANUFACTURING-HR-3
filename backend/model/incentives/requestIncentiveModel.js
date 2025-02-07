import mongoose from "mongoose";


const requestIncentiveSchema = new mongoose.Schema({
    incentiveType:{
        type:String
    },
    comments:{
        type:String
    }
},{timestamps:true});

export const RequestIncentive = mongoose.model("RequestIncentive",requestIncentiveSchema);    