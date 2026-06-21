import { Router } from "express";
import { approveResumeVersion, generateResumeVersion, getResumePdf, listResumeVersions } from "../controllers/applicationMaterialController.js";

export const applicationMaterialRoutes = Router();
applicationMaterialRoutes.get("/", listResumeVersions);
applicationMaterialRoutes.post("/generate", generateResumeVersion);
applicationMaterialRoutes.post("/approve", approveResumeVersion);
applicationMaterialRoutes.get("/:id/pdf", getResumePdf);
