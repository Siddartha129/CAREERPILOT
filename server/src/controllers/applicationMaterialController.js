import { tailorResume } from "../agents/applicationPreparationAgent.js";
import { markApplicationPreparing } from "./applicationController.js";
import { repo } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { textToPdf } from "../utils/pdf.js";

export const listResumeVersions = asyncHandler(async (req, res) => {
  const resumeVersions = await repo.getAll("resumeVersions", { userId: req.user._id }, { createdAt: -1 });
  res.json({ resumeVersions });
});

export const generateResumeVersion = asyncHandler(async (req, res) => {
  const [profile, internship] = await Promise.all([
    repo.getOne("profiles", { userId: req.user._id }),
    repo.getById("internships", req.body.internshipId)
  ]);
  if (!profile?.resumeText) throw httpError(400, "Upload a resume first");
  if (!internship) throw httpError(404, "Internship not found");
  const match = await repo.getOne("matches", { userId: req.user._id, internshipId: internship._id }) || { matchedSkills: [], missingSkills: internship.skillsRequired || [] };
  const generated = tailorResume({ profile, internship, match });
  const resumeVersion = await repo.create("resumeVersions", {
    userId: req.user._id,
    internshipId: internship._id,
    ...generated
  });
  await markApplicationPreparing(req.user._id, internship._id);
  res.status(201).json({ resumeVersion });
});

export const approveResumeVersion = asyncHandler(async (req, res) => {
  const resumeVersion = await repo.getById("resumeVersions", req.body.resumeVersionId);
  if (!resumeVersion || String(resumeVersion.userId) !== String(req.user._id)) throw httpError(404, "Resume version not found");
  res.json({ resumeVersion: await repo.updateById("resumeVersions", resumeVersion._id, { approved: true }) });
});

export const getResumePdf = asyncHandler(async (req, res) => {
  const resumeVersion = await repo.getById("resumeVersions", req.params.id);
  if (!resumeVersion || String(resumeVersion.userId) !== String(req.user._id)) throw httpError(404, "Resume version not found");
  const buffer = textToPdf(resumeVersion.content);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="careerpilot-${String(resumeVersion._id).slice(0, 8)}.pdf"`);
  res.send(buffer);
});
