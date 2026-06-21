export function MetricCard({ label, value }) {
  return <div className="card p-5"><p className="text-sm font-bold text-ink/55">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>;
}
