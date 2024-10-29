import mongoose from "mongoose";

const requestedSalary = new mongoose.Schema({
    employeeId:{
      type:mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    requestedAmount:{
      type:Number,
      required:true,
    },
    paymentMethod:{
      type:String,
      enum:['Cash', 'GCash'],
      required:true,
    },
    gCashNumber:{
      type:String,
      required:function() {
        return this.paymentMethod === 'GCash';
      },
    },
    status:{
      type:String,
      enum:["Pending","Rejected","Approved"],
      default:'Pending',
    },
    isAvailable:{
      type:Boolean,
      default:true,
    }
  },
  {timestamps:true});

export const RequestedSalary = mongoose.model("RequestedSalary",requestedSalary);
