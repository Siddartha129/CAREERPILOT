import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  score: { type: Number, default: 0 },
  matchedSkills: [String],
  missingSkills: [String],
  reason: { type: String, default: "" }
}, { timestamps: true });

matchSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

export const Match = mongoose.model("Match", matchSchema);
