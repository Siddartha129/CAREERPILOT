import { Bell, BriefcaseBusiness, ChartNoAxesColumn, FileCheck2, FileSearch, Gauge, Search, Sparkles } from "lucide-react";

const icons = [FileSearch, Search, Gauge, Sparkles, FileCheck2, BriefcaseBusiness, ChartNoAxesColumn, Bell];

export function WorkflowGraph({ profile, internships = [], applications = [], notifications = [], resumeVersions = [] }) {
  const hasResume = Boolean(profile?.resumeText);
  const stages = [
    ["Profile Agent", hasResume],
    ["Discovery Agent", hasResume && internships.length > 0],
    ["Matching Agent", internships.some((item) => item.match)],
    ["Skill-Gap Agent", internships.some((item) => item.match?.missingSkills?.length || item.match?.matchedSkills?.length)],
    ["Preparation Agent", resumeVersions.length > 0],
    ["Tracker Agent", applications.length > 0],
    ["Feedback Agent", applications.some((item) => ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(item.status))],
    ["Notification Agent", notifications.length > 0]
  ];
  const activeCount = stages.filter((stage) => stage[1]).length;

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">Workflow Automation</h2>
        <span className="rounded-md bg-ink px-2 py-1 text-sm font-black text-white">{activeCount}/8 stages active</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map(([label, active], index) => {
          const Icon = icons[index];
          return (
            <div key={label} className={`rounded-md border p-3 ${active ? "border-moss bg-moss/10" : "border-ink/10 bg-white"}`}>
              <div className="flex items-center gap-2">
                <Icon size={18} className={active ? "text-moss" : "text-ink/45"} />
                <span className="font-black">{label}</span>
              </div>
              <p className={`mt-2 text-xs font-bold ${active ? "text-moss" : "text-ink/45"}`}>{active ? "Active" : "Waiting"}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
