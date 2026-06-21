import { Router } from "express";
import { listInternships, syncInternships } from "../controllers/internshipController.js";

export const internshipRoutes = Router();
internshipRoutes.get("/", listInternships);
internshipRoutes.post("/sync", syncInternships);
