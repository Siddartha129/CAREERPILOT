import { Router } from "express";
import { listNotifications, markRead } from "../controllers/notificationController.js";

export const notificationRoutes = Router();
notificationRoutes.get("/", listNotifications);
notificationRoutes.patch("/:id/read", markRead);
