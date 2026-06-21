export const knownSkills = [
  "javascript", "react", "node.js", "express", "mongodb", "python", "sql",
  "html", "css", "tailwind", "git", "rest api", "machine learning", "data analysis",
  "typescript", "aws", "docker", "kubernetes", "figma", "ux research", "testing",
  "communication", "problem solving", "product management", "java"
];

export function normalizeSkill(skill = "") {
  return skill.trim().toLowerCase().replace(/\s+/g, " ");
}

export function uniqueStrings(values = []) {
  const seen = new Set();
  return values.map((value) => String(value || "").trim()).filter(Boolean).filter((value) => {
    const key = normalizeSkill(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function extractSkills(text = "") {
  const lower = text.toLowerCase();
  return knownSkills.filter((skill) => lower.includes(skill));
}

export function summarizeText(text = "", max = 220) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 3).trim()}...`;
}

export function parseListInput(value) {
  if (Array.isArray(value)) return uniqueStrings(value);
  return uniqueStrings(String(value || "").split(/[,|;/\n]/));
}

export function sectionLines(text = "", labels = [], max = 8) {
  const lowerLabels = labels.map((label) => label.toLowerCase());
  return uniqueStrings(
    text.split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 4 && lowerLabels.some((label) => line.toLowerCase().includes(label)))
  ).slice(0, max);
}
