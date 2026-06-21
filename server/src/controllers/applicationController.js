import { APPLICATION_STATUSES, STATUS_RANK } from "../models/index.js";
import { repo } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { createNotification, notifyMilestone } from "./notificationController.js";

async function enrich(application) {
  return { ...application, internship: await repo.getById("internships", application.internshipId) };
}

export async function markApplicationPreparing(userId, internshipId) {
  const existing = await repo.getOne("applications", { userId, internshipId });
  if (!existing) return repo.create("applications", { userId, internshipId, status: "PREPARING" });
  if (STATUS_RANK[existing.status] < STATUS_RANK.PREPARING) return repo.updateById("applications", existing._id, { status: "PREPARING" });
  return existing;
}

export const createApplication = asyncHandler(async (req, res) => {
  const internship = await repo.getById("internships", req.body.internshipId);
  if (!internship) throw httpError(404, "Internship not found");
  const requestedStatus = APPLICATION_STATUSES.includes(req.body.status) ? req.body.status : "SAVED";
  const existing = await repo.getOne("applications", { userId: req.user._id, internshipId: internship._id });
  let application;
  if (existing) {
    const nextStatus = STATUS_RANK[requestedStatus] > STATUS_RANK[existing.status] ? requestedStatus : existing.status;
    const statusChanged = nextStatus !== existing.status;
    application = await repo.updateById("applications", existing._id, {
      status: nextStatus,
      appliedAt: !existing.appliedAt && nextStatus === "APPLIED" ? new Date() : existing.appliedAt,
      nextActionDate: req.body.nextActionDate || existing.nextActionDate,
      notes: req.body.notes ?? existing.notes
    });
    if (statusChanged) await notifyMilestone(req.user._id, nextStatus, internship);
  } else {
    application = await repo.create("applications", {
      userId: req.user._id,
      internshipId: internship._id,
      status: requestedStatus,
      appliedAt: requestedStatus === "APPLIED" ? new Date() : undefined,
      nextActionDate: req.body.nextActionDate || undefined,
      notes: req.body.notes || ""
    });
    await createNotification(req.user._id, "Application saved", `${internship.title} at ${internship.company} was added to your tracker.`);
    await notifyMilestone(req.user._id, requestedStatus, internship);
  }
  res.status(existing ? 200 : 201).json({ application: await enrich(application) });
});

export const listApplications = asyncHandler(async (req, res) => {
  const applications = await repo.getAll("applications", { userId: req.user._id }, { updatedAt: -1 });
  res.json({ applications: await Promise.all(applications.map(enrich)) });
});

export const updateApplication = asyncHandler(async (req, res) => {
  const application = await repo.getById("applications", req.params.id);
  if (!application || String(application.userId) !== String(req.user._id)) throw httpError(404, "Application not found");
  const internship = await repo.getById("internships", application.internshipId);
  const status = APPLICATION_STATUSES.includes(req.body.status) ? req.body.status : application.status;
  const statusChanged = status !== application.status;
  const updated = await repo.updateById("applications", application._id, {
    status,
    appliedAt: !application.appliedAt && status === "APPLIED" ? new Date() : application.appliedAt,
    nextActionDate: req.body.nextActionDate || application.nextActionDate,
    notes: req.body.notes ?? application.notes
  });
  if (statusChanged) await notifyMilestone(req.user._id, status, internship);
  res.json({ application: await enrich(updated) });
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await repo.getById("applications", req.params.id);
  if (!application || String(application.userId) !== String(req.user._id)) throw httpError(404, "Application not found");
  await repo.deleteById("applications", application._id);
  res.json({ success: true, id: application._id });
});
