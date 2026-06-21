import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { analyticsApi, applicationApi, internshipApi, materialApi, notificationApi, profileApi } from "../api/queries.js";
import { Button } from "../components/Button.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { MetricCard } from "../components/MetricCard.jsx";
import { WorkflowGraph } from "../components/WorkflowGraph.jsx";

export function Dashboard() {
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const internshipsQuery = useQuery({ queryKey: ["internships"], queryFn: internshipApi.list });
  const appsQuery = useQuery({ queryKey: ["applications"], queryFn: applicationApi.list });
  const notificationsQuery = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });
  const versionsQuery = useQuery({ queryKey: ["resume-versions"], queryFn: materialApi.list });
  const analyticsQuery = useQuery({ queryKey: ["analytics"], queryFn: analyticsApi.get });
  if (profileQuery.isLoading) return <LoadingState label="Loading dashboard..." />;
  const profile = profileQuery.data?.profile;
  const internships = internshipsQuery.data?.internships || [];
  const applications = appsQuery.data?.applications || [];
  const notifications = notificationsQuery.data?.notifications || [];
  const resumeVersions = versionsQuery.data?.resumeVersions || [];
  const analytics = analyticsQuery.data?.analytics || {};
  return (
    <div className="space-y-6">
      <WorkflowGraph profile={profile} internships={internships} applications={applications} notifications={notifications} resumeVersions={resumeVersions} />
      <section className="card p-6">
        <p className="text-xs font-black uppercase tracking-wide text-moss">CareerPilot AI</p>
        <h2 className="mt-1 text-3xl font-black">Your internship pipeline</h2>
        <p className="mt-3 max-w-2xl text-ink/70">Upload a resume, sync internships, generate matches, tailor materials, and track outcomes from one workspace.</p>
        <div className="mt-5 flex flex-wrap gap-2"><Link to="/profile"><Button variant="secondary">Profile</Button></Link><Link to="/internships"><Button>Find Internships</Button></Link></div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Applications" value={analytics.totalApplications || 0} />
        <MetricCard label="Skills found" value={profile?.skills?.length || 0} />
        <MetricCard label="Resume versions" value={resumeVersions.length} />
      </section>
      <section className="card p-5">
        <h3 className="text-xl font-black">Ranked Opportunities</h3>
        <div className="mt-3 grid gap-3">
          {internships.slice(0, 5).map((item) => <Link key={item._id} to={`/internships/${item._id}`} className="rounded-md border border-ink/10 p-3 hover:bg-ink/5"><p className="font-black">{item.title}</p><p className="text-sm text-ink/65">{item.company} · {item.match ? `${item.match.score}% match` : "No match yet"}</p></Link>)}
        </div>
      </section>
    </div>
  );
}
