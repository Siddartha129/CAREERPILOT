import { buildAnalytics } from "../agents/feedbackAgent.js";
import { repo } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const [applications, matches, internships, profile] = await Promise.all([
    repo.getAll("applications", { userId: req.user._id }),
    repo.getAll("matches", { userId: req.user._id }),
    repo.getAll("internships"),
    repo.getOne("profiles", { userId: req.user._id })
  ]);
  res.json({ analytics: buildAnalytics({ applications, matches, internships, profile }) });
});
