import mongoose from "mongoose";


const requestIncentiveSchema = new mongoose.Schema({
        employeeId:{
          type:mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
    incentiveType:{
        type:String
    },
    comments:{
        type:String
    }
},{timestamps:true});

export const RequestIncentive = mongoose.model("RequestIncentive",requestIncentiveSchema);    