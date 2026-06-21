import { Router } from "express";
import { generateMatches, listMatches } from "../controllers/matchController.js";

export const matchRoutes = Router();
matchRoutes.post("/generate", generateMatches);
matchRoutes.get("/", listMatches);
