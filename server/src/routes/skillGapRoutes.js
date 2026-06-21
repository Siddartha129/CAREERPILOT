import { Router } from "express";
import { getSkillGap } from "../controllers/skillGapController.js";

export const skillGapRoutes = Router();
skillGapRoutes.get("/:internshipId", getSkillGap);
