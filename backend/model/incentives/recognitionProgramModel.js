import mongoose from "mongoose";

const recognitionProgramSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  awardName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  rewardType: {
    type: String,
    enum: ['Bonus', 'Gift', 'Promotion', 'Cash'],
    required: true
},
  rewardValue: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Not Claimed", "Claimed"],
    default: "Not Claimed",
  },
}, { timestamps: true });

export const RecognitionProgram = mongoose.model("RecognitionProgram", recognitionProgramSchema);
