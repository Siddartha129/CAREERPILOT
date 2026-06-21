import { repo } from "../services/repository.js";
import { regenerateMatches } from "../services/pipelineService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const generateMatches = asyncHandler(async (req, res) => {
  const profile = await repo.getOne("profiles", { userId: req.user._id });
  if (!profile) throw httpError(400, "Create a profile first");
  if (!profile.resumeText) throw httpError(400, "Upload a resume first");
  const matches = await regenerateMatches(req.user._id, profile);
  res.json({ matches });
});

export const listMatches = asyncHandler(async (req, res) => {
  const matches = await repo.getAll("matches", { userId: req.user._id }, { score: -1 });
  const enriched = [];
  for (const match of matches) {
    enriched.push({ ...match, internship: await repo.getById("internships", match.internshipId) });
  }
  res.json({ matches: enriched });
});
