import mongoose from "mongoose";

const resumeHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  label: String,
  skills: [String],
  summary: String,
  topMatches: [{ title: String, company: String, score: Number }],
  matchCount: { type: Number, default: 0 },
  highMatchCount: { type: Number, default: 0 },
  resumeVersionCount: { type: Number, default: 0 },
  supersededAt: Date
}, { timestamps: true });

export const ResumeHistory = mongoose.model("ResumeHistory", resumeHistorySchema);
