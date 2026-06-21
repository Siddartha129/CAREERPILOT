import { uniqueStrings } from "../utils/text.js";

function titleCaseSkill(skill) {
  return String(skill || "").split(" ").map((part) => part ? part[0].toUpperCase() + part.slice(1) : part).join(" ");
}

function splitSkills(line) {
  return uniqueStrings(line.replace(/^skills\s*:?/i, "").split(/[,|;/\u2022]/));
}

function tailoredSkillsLine(existingSkills, requiredSkills, matchedSkills) {
  const requiredOrder = requiredSkills.map((skill) => skill.toLowerCase());
  const current = uniqueStrings(existingSkills);
  const currentKeys = new Set(current.map((skill) => skill.toLowerCase()));
  const matchedToAdd = matchedSkills.filter((skill) => !currentKeys.has(skill.toLowerCase())).map(titleCaseSkill);
  const ordered = [
    ...current.filter((skill) => requiredOrder.includes(skill.toLowerCase())).sort((a, b) => requiredOrder.indexOf(a.toLowerCase()) - requiredOrder.indexOf(b.toLowerCase())),
    ...matchedToAdd,
    ...current.filter((skill) => !requiredOrder.includes(skill.toLowerCase()))
  ];
  return `Skills: ${uniqueStrings(ordered).join(", ")}`;
}

export function tailorResume({ profile, internship, match }) {
  const text = profile.resumeText || "";
  const lines = text.split(/\r?\n/);
  const skillsIndex = lines.findIndex((line) => /^skills\s*:/i.test(line.trim()));
  const matchedSkills = match?.matchedSkills || [];
  const missingSkills = match?.missingSkills || [];
  const requiredSkills = internship?.skillsRequired || [];
  const changeSummary = [
    `Skills section reordered toward ${internship.title} at ${internship.company}.`,
    missingSkills.length ? `Missing skills to strengthen: ${missingSkills.join(", ")}.` : "No required skills are missing from the current match.",
    "Human approval required before submitting this tailored resume."
  ];

  if (skillsIndex >= 0) {
    lines[skillsIndex] = tailoredSkillsLine(splitSkills(lines[skillsIndex]), requiredSkills, matchedSkills);
  } else {
    lines.splice(Math.min(2, lines.length), 0, tailoredSkillsLine(profile.skills || [], requiredSkills, matchedSkills));
  }

  return {
    content: lines.join("\n"),
    changeSummary,
    matchedSkills,
    missingSkills,
    approved: false
  };
}
