import { repo } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const milestoneCopy = {
  APPLIED: ["Application submitted", "was marked as applied."],
  INTERVIEW: ["Interview stage", "moved to Interview. Prepare talking points."],
  OFFER: ["Offer received", "resulted in an offer."],
  REJECTED: ["Application closed", "was marked rejected. Capture the learnings and keep going."]
};

export async function createNotification(userId, title, message) {
  return repo.create("notifications", { userId, title, message, read: false });
}

export async function notifyMilestone(userId, status, internship) {
  const copy = milestoneCopy[status];
  if (!copy) return null;
  const label = `${internship.title} at ${internship.company}`;
  return createNotification(userId, copy[0], `${label} ${copy[1]}`);
}

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await repo.getAll("notifications", { userId: req.user._id }, { createdAt: -1 });
  res.json({ notifications });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await repo.getById("notifications", req.params.id);
  if (!notification || String(notification.userId) !== String(req.user._id)) throw httpError(404, "Notification not found");
  res.json({ notification: await repo.updateById("notifications", notification._id, { read: true }) });
});
