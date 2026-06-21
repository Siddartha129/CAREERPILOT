import { Router } from "express";
import { getHistory, getProfile, updatePreferences, upload, uploadResume } from "../controllers/profileController.js";

export const profileRoutes = Router();

profileRoutes.get("/", getProfile);
profileRoutes.get("/history", getHistory);
profileRoutes.post("/upload-resume", upload.single("resume"), uploadResume);
profileRoutes.patch("/preferences", updatePreferences);
