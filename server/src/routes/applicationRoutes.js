import { Router } from "express";
import { createApplication, deleteApplication, listApplications, updateApplication } from "../controllers/applicationController.js";

export const applicationRoutes = Router();
applicationRoutes.post("/", createApplication);
applicationRoutes.get("/", listApplications);
applicationRoutes.patch("/:id", updateApplication);
applicationRoutes.delete("/:id", deleteApplication);
