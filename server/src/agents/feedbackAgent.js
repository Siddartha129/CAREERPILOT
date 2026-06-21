export function buildAnalytics({ applications, matches, internships, profile }) {
  const totalApplications = applications.length;
  const interviewCount = applications.filter((app) => ["INTERVIEW", "OFFER"].includes(app.status)).length;
  const offerCount = applications.filter((app) => app.status === "OFFER").length;
  const appliedIds = new Set(applications.map((app) => String(app.internshipId)));
  const appliedMatches = matches.filter((match) => appliedIds.has(String(match.internshipId)));
  const avg = appliedMatches.length ? Math.round(appliedMatches.reduce((sum, match) => sum + (match.score || 0), 0) / appliedMatches.length) : 0;
  const profileSkills = new Set((profile?.skills || []).map((skill) => skill.toLowerCase()));
  const counts = new Map();
  for (const internship of internships) {
    for (const skill of internship.skillsRequired || []) {
      if (profileSkills.has(skill.toLowerCase())) counts.set(skill, (counts.get(skill) || 0) + 1);
    }
  }

  return {
    totalApplications,
    interviewRate: totalApplications ? Math.round((interviewCount / totalApplications) * 100) : 0,
    offerRate: totalApplications ? Math.round((offerCount / totalApplications) * 100) : 0,
    matchScoreEffectiveness: avg,
    topPerformingSkills: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([skill, count]) => ({ skill, count })),
    recommendationNote: avg >= 70 ? "Your applied roles are well aligned. Keep prioritizing high-match openings." : "Improve alignment by closing missing skills before applying to more roles."
  };
}
