import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/queries.js";
import { LoadingState } from "../components/LoadingState.jsx";
import { MetricCard } from "../components/MetricCard.jsx";

export function Analytics() {
  const query = useQuery({ queryKey: ["analytics"], queryFn: analyticsApi.get });
  if (query.isLoading) return <LoadingState label="Loading analytics..." />;
  const analytics = query.data?.analytics || {};
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-black">Analytics</h2>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Applications" value={analytics.totalApplications || 0} />
        <MetricCard label="Interview Rate" value={`${analytics.interviewRate || 0}%`} />
        <MetricCard label="Offer Rate" value={`${analytics.offerRate || 0}%`} />
        <MetricCard label="Match Effectiveness" value={`${analytics.matchScoreEffectiveness || 0}%`} />
      </section>
      <section className="card p-5">
        <h3 className="text-xl font-black">Top-Performing Skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">{(analytics.topPerformingSkills || []).map((item) => <span key={item.skill} className="rounded-md bg-moss/10 px-2 py-1 text-sm font-bold text-moss">{item.skill} · {item.count}</span>)}</div>
      </section>
      <section className="card p-5">
        <h3 className="text-xl font-black">Recommendation</h3>
        <p className="mt-2 text-ink/75">{analytics.recommendationNote}</p>
      </section>
    </div>
  );
}
