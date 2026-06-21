export function buildSkillGap(match) {
  const missing = match?.missingSkills || [];
  return missing.map((skill, index) => ({
    skill,
    priority: index < 2 ? "High" : "Medium",
    suggestedAction: `Complete a focused ${skill} tutorial and apply it in a small feature.`,
    miniProject: `Build a portfolio mini project demonstrating ${skill} for this internship.`
  }));
}
