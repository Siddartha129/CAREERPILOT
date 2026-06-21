import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, default: "" },
  skillsRequired: [String],
  location: { type: String, default: "" },
  applyLink: { type: String, required: true },
  source: { type: String, default: "Catalog" },
  deadline: Date,
  postedDate: Date,
  embedding: [Number]
}, { timestamps: true });

internshipSchema.index({ company: 1, title: 1, applyLink: 1 }, { unique: true });

export const Internship = mongoose.model("Internship", internshipSchema);
