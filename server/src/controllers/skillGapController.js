import { buildSkillGap } from "../agents/skillGapAgent.js";
import { repo } from "../services/repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { httpError } from "../utils/httpError.js";

export const getSkillGap = asyncHandler(async (req, res) => {
  const match = await repo.getOne("matches", { userId: req.user._id, internshipId: req.params.internshipId });
  if (!match) throw httpError(404, "Generate matches before viewing skill gaps");
  res.json({ skillGap: buildSkillGap(match) });
});
