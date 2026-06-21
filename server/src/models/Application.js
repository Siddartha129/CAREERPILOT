import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["SAVED", "PREPARING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
export const STATUS_RANK = { SAVED: 0, PREPARING: 1, APPLIED: 2, INTERVIEW: 3, OFFER: 4, REJECTED: 4 };

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  status: { type: String, enum: APPLICATION_STATUSES, default: "SAVED" },
  appliedAt: Date,
  nextActionDate: Date,
  notes: { type: String, default: "" }
}, { timestamps: true });

applicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
