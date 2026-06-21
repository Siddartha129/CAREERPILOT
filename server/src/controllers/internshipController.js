import { repo } from "../services/repository.js";
import { syncInternshipsForProfile } from "../services/pipelineService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listInternships = asyncHandler(async (req, res) => {
  const [internships, matches] = await Promise.all([
    repo.getAll("internships", {}, { postedDate: -1 }),
    repo.getAll("matches", { userId: req.user._id })
  ]);
  const matchByInternship = new Map(matches.map((match) => [String(match.internshipId), match]));
  res.json({ internships: internships.map((internship) => ({ ...internship, match: matchByInternship.get(String(internship._id)) || null })) });
});

export const syncInternships = asyncHandler(async (req, res) => {
  const profile = await repo.getOne("profiles", { userId: req.user._id });
  const internships = await syncInternshipsForProfile(profile);
  res.json({ count: internships.length, internships });
});
