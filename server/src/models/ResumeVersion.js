import mongoose from "mongoose";

const resumeVersionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  content: { type: String, default: "" },
  changeSummary: [String],
  matchedSkills: [String],
  missingSkills: [String],
  approved: { type: Boolean, default: false }
}, { timestamps: true });

export const ResumeVersion = mongoose.model("ResumeVersion", resumeVersionSchema);
