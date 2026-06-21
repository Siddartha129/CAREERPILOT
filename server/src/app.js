import cors from "cors";
import express from "express";
import { allowedOrigins, env } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
import { internshipRoutes } from "./routes/internshipRoutes.js";
import { matchRoutes } from "./routes/matchRoutes.js";
import { skillGapRoutes } from "./routes/skillGapRoutes.js";
import { applicationMaterialRoutes } from "./routes/applicationMaterialRoutes.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const privateLan = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):\d+$/;

export const app = express();

app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (env.NODE_ENV === "development" && privateLan.test(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CareerPilot AI API", aiRuntime: "Ollama local inference", autoApplyEnabled: false });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/internships", requireAuth, internshipRoutes);
app.use("/api/matches", requireAuth, matchRoutes);
app.use("/api/skill-gaps", requireAuth, skillGapRoutes);
app.use("/api/application-materials", requireAuth, applicationMaterialRoutes);
app.use("/api/applications", requireAuth, applicationRoutes);
app.use("/api/notifications", requireAuth, notificationRoutes);
app.use("/api/analytics", requireAuth, analyticsRoutes);

app.use(notFound);
app.use(errorHandler);
