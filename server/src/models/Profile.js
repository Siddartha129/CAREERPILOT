import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  skills: [String],
  projects: [String],
  experience: [String],
  education: [String],
  preferences: {
    roles: [String],
    location: { type: String, default: "" },
    workMode: { type: String, default: "" },
    stipendRange: { type: String, default: "" }
  },
  resumeText: { type: String, default: "" },
  embedding: [Number]
}, { timestamps: true });

export const Profile = mongoose.model("Profile", profileSchema);
