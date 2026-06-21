import multer from "multer";
import { parseResume } from "../agents/profileAgent.js";
import { repo } from "../services/repository.js";
import { syncInternshipsForProfile } from "../services/pipelineService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";
import { parseListInput, summarizeText } from "../utils/text.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") cb(httpError(400, "Only PDF resumes are supported"));
    else cb(null, true);
  }
});

export const getProfile = asyncHandler(async (req, res) => {
  let profile = await repo.getOne("profiles", { userId: req.user._id });
  if (!profile) {
    profile = await repo.create("profiles", { userId: req.user._id, skills: [], projects: [], experience: [], education: [], preferences: { roles: [], location: "", workMode: "", stipendRange: "" }, resumeText: "", embedding: [] });
  }
  res.json({ profile });
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await repo.getAll("resumeHistory", { userId: req.user._id }, { createdAt: -1 });
  res.json({ history });
});

async function archivePreviousResume(userId, profile) {
  if (!profile?.resumeText) return;
  const [matches, versions, history] = await Promise.all([
    repo.getAll("matches", { userId }, { score: -1 }),
    repo.getAll("resumeVersions", { userId }),
    repo.getAll("resumeHistory", { userId })
  ]);
  const topMatches = [];
  for (const match of matches.slice(0, 3)) {
    const internship = await repo.getById("internships", match.internshipId);
    if (internship) topMatches.push({ title: internship.title, company: internship.company, score: match.score });
  }
  await repo.create("resumeHistory", {
    userId,
    label: `Resume #${history.length + 1}`,
    skills: profile.skills || [],
    summary: summarizeText(profile.resumeText, 180),
    topMatches,
    matchCount: matches.length,
    highMatchCount: matches.filter((match) => match.score >= 80).length,
    resumeVersionCount: versions.length,
    supersededAt: new Date()
  });
}

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw httpError(400, "Resume file is required");
  let parsed;
  try {
    parsed = await parseResume(req.file.buffer);
  } catch {
    throw httpError(422, "Could not read enough text from this PDF");
  }
  if (!parsed.resumeText || parsed.resumeText.length < 30) throw httpError(422, "Could not read enough text from this PDF");

  const existing = await repo.getOne("profiles", { userId: req.user._id });
  await archivePreviousResume(req.user._id, existing);

  const preferences = existing?.preferences || { roles: [], location: "", workMode: "", stipendRange: "" };
  const profile = await repo.upsert("profiles", { userId: req.user._id }, { userId: req.user._id }, {
    skills: parsed.skills,
    projects: parsed.projects,
    experience: parsed.experience,
    education: parsed.education,
    resumeText: parsed.resumeText,
    embedding: parsed.embedding,
    preferences
  });

  await repo.deleteWhere("matches", { userId: req.user._id });
  await repo.deleteWhere("resumeVersions", { userId: req.user._id });
  try {
    await syncInternshipsForProfile(profile);
  } catch (error) {
    console.warn("Discovery sync after upload failed:", error.message);
  }

  res.json({ profile, summary: parsed.summary, pipelineReset: true });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const profile = await repo.getOne("profiles", { userId: req.user._id });
  if (!profile) throw httpError(404, "Profile not found");
  const preferences = {
    roles: parseListInput(req.body.roles),
    location: String(req.body.location || ""),
    workMode: String(req.body.workMode || ""),
    stipendRange: String(req.body.stipendRange || "")
  };
  const updated = await repo.updateById("profiles", profile._id, { preferences });
  res.json({ profile: updated });
});
