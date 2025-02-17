import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    position:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    middleName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    passwordReset: { 
        type: Boolean,
         default: false
     },
     passwordResetOTP:{
        type:String,
        default:null,
    },
    passwordResetOTPExpiration:{
        type:Date,
        default:null,
    },
    lastOtpSentAt: Date,
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        street: {
            type:String,
            required:true
        },
        municipality:{
            type:String,
            required:true
        },
        province:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    },
    gender:{
        type:String,
        enum:["Male","Female"],
        required:true
    },
    bDate:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Employee","Admin"],
        default:"Employee",
        required:true
    },
    uniqueRole: {
        type: String,
        unique: true,
    },
    profilePic: {
        type: String,
        default: "https://www.pngkey.com/png/full/121-1219231_user-default-profile.png"
    },
/*     verified:{
        type:Boolean,
        default:false,
    }, */
    lastVerificationRequest:{
        type: Date,
        default: null
    }

},{timestamps:true});

export const User = mongoose.model("User",userSchema);