import { discoverInternships } from "../agents/discoveryAgent.js";
import { scoreInternship } from "../agents/matchingAgent.js";
import { repo } from "./repository.js";

export async function syncInternshipsForProfile(profile = null) {
  const discovered = await discoverInternships(profile);
  const saved = [];
  for (const internship of discovered) {
    saved.push(await repo.upsert(
      "internships",
      { title: internship.title, company: internship.company },
      internship,
      internship
    ));
  }
  return saved;
}

export async function regenerateMatches(userId, profile) {
  const internships = await repo.getAll("internships");
  const matches = [];
  for (const internship of internships) {
    const scored = scoreInternship(profile, internship);
    matches.push(await repo.upsert(
      "matches",
      { userId, internshipId: internship._id },
      { userId, internshipId: internship._id },
      scored
    ));
  }
  return matches.sort((a, b) => b.score - a.score);
}
