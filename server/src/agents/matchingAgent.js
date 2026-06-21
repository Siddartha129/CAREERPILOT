import { normalizeSkill } from "../utils/text.js";

export function scoreInternship(profile, internship) {
  const profileSkills = new Set((profile?.skills || []).map(normalizeSkill));
  const required = internship.skillsRequired || [];
  const matchedSkills = required.filter((skill) => profileSkills.has(normalizeSkill(skill)));
  const missingSkills = required.filter((skill) => !profileSkills.has(normalizeSkill(skill)));
  const coverage = required.length ? matchedSkills.length / required.length : 0;
  const preferenceBonus = (profile?.preferences?.roles || []).some((role) => `${internship.title} ${internship.description}`.toLowerCase().includes(normalizeSkill(role))) ? 10 : 0;
  const score = Math.min(100, Math.round(coverage * 85 + preferenceBonus));

  return {
    score,
    matchedSkills,
    missingSkills,
    reason: matchedSkills.length
      ? `Matched ${matchedSkills.length} required skill${matchedSkills.length === 1 ? "" : "s"}: ${matchedSkills.join(", ")}.`
      : "No direct skill overlap yet; build the missing skills before applying."
  };
}
