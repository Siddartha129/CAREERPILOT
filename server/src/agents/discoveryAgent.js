import { env } from "../config/env.js";
import { internshipCatalog } from "../data/internshipCatalog.js";
import { seedInternships } from "../data/seedInternships.js";
import { normalizeSkill } from "../utils/text.js";

function scoreCatalogItem(profile, internship) {
  const skills = new Set((profile?.skills || []).map(normalizeSkill));
  const roles = (profile?.preferences?.roles || []).map(normalizeSkill);
  const required = internship.skillsRequired.map(normalizeSkill);
  const skillHits = required.filter((skill) => skills.has(skill)).length;
  const roleHits = roles.filter((role) => normalizeSkill(`${internship.title} ${internship.description}`).includes(role)).length;
  return skillHits * 20 + roleHits * 12;
}

async function fetchLiveInternships(profile) {
  if (!env.ENABLE_LIVE_DISCOVERY || typeof fetch !== "function") return [];
  const term = encodeURIComponent((profile?.preferences?.roles?.[0] || profile?.skills?.[0] || "intern").replace("node.js", "node"));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(`https://remotive.com/api/remote-jobs?search=${term}&limit=8`, { signal: controller.signal });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.jobs || []).slice(0, 8).map((job) => ({
      title: job.title,
      company: job.company_name,
      description: String(job.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 600),
      skillsRequired: profile?.skills?.slice(0, 5) || [],
      location: job.candidate_required_location || "Remote",
      applyLink: job.url,
      source: "Remotive",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      postedDate: job.publication_date ? new Date(job.publication_date) : new Date()
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function discoverInternships(profile = null) {
  const hasSignal = (profile?.skills?.length || 0) > 0 || (profile?.preferences?.roles?.length || 0) > 0;
  if (!hasSignal) return seedInternships;

  const ranked = internshipCatalog
    .map((item) => ({ item, score: scoreCatalogItem(profile, item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  const live = await fetchLiveInternships(profile);
  const combined = [...live, ...ranked];
  return combined.length ? combined : seedInternships;
}
